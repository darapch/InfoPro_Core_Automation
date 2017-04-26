'Function Name	: func_invokeapplication(str_Path)
'Parameters		: The path to the .exe file is passed as a parameter
'Description	: Function is used to invoke the infopro application
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_invokeapplication(str_Path)
	invokeapplication (str_Path)
	Wait (5)
	
	If (err.number = 0) Then
		Call func_reportStatus("PASS", "Infopro Application opened successfully", "")
	Else
		Call func_reportStatus("FAIL", "Error while opening Infopro Application", err.description)
	End If 'If (err.number = 0) Then
End Function 'Function func_invokeapplication(str_Path)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_handleLoginPopup(str_title)
'Parameters		: The title of the pop up is used as parameter
'Description	: Function is used to handle the pop up when the application is invoked
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_handleLoginPopup(str_title)
	Dim obj_WShell
	Set obj_WShell = CreateObject("wscript.shell")
	
	Do Until obj_WShell.AppActivate(str_title)
  		Wait (2)
  	Loop 'Do Until obj_WShell.AppActivate(str_title)
  	
	If Dialog(str_title).Exist(5) Then
		If (str_title = "Configure PC5250") Then
			Dialog("Configure PC5250").Winedit("SystemName").Set "SYS01"
			obj_WShell.Sendkeys "{ENTER}"
		Else
			obj_WShell.Sendkeys "{DEL}"
			obj_WShell.Sendkeys Environment.Value("UName")
			obj_WShell.Sendkeys "{TAB}"
			obj_WShell.Sendkeys Environment.Value("Password")
			obj_WShell.Sendkeys "{enter}"
		End If 'If (str_title = "Configure PC5250") Then
	End If 'If Window(str_title).Dialog(str_title).Exist(5) Then
		
	Set obj_WShell = NOTHING
End Function 'Function func_handleLoginPopup(str_title)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_Login()
'Parameters		: The user name and password are passed as parameters
'Description	: Function is used to login to the infopro application
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_Login()
	Call func_SendKey("MAXIMIZE")
	
	If (TEWindow("InfoProWindow").TEScreen("Login").TEField("UserId").Exist(5)) Then
		If (TEWindow("InfoProWindow").TEScreen("Login").TEField("Password").Exist(5)) Then
			TEWindow("InfoProWindow").TEScreen("Login").TEField("UserId").Set Environment.Value("UName")
			TEWindow("InfoProWindow").TEScreen("Login").TEField("Password").Set Environment.Value("Password")
			
			Call func_reportStatus("PASS", "Login Credentials entered", "User Id: "&Environment.Value("UName")&", Password: "&Environment.Value("Password"))
			Call func_SendKey("ENTER")
		Else
			Call func_reportStatus("FAIL", "Login screen fail", "Password field does not exist")
		End If 'If (TEWindow("InfoProWindow").TEScreen("Login").TEField("Password").Exist(5)) Then
	Else
		Call func_reportStatus("FAIL", "Login screen fail", "User Id field does not exist")
	End If 'If (TEWindow("InfoProWindow").TEScreen("Login").TEField("UserId").Exist(5)) Then
	
End Function 'Function func_Login()
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_retrieveData(str_query, str_dataSheet)
'Parameters		: The query which has to be executed and the name of the datasheet in which the data has to be imported
'Description	: Function is used to connect to the database and execute the query passed as a parameter and export the result to the datasheet
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_retrieveData(str_query, str_dataSheet)
	Dim obj_conn, obj_resultSet, obj_dataSheet
	Dim str_connectionString, str_sqlQuery, str_dataSheetname, str_field
	Dim obj_TempDataSheet, obj_cspoNumber

	Set obj_conn = CreateObject("ADODB.Connection")
	Set obj_resultSet = CreateObject("ADODB.Recordset")
	Set obj_dataSheet = Datatable.Addsheet(Ucase(str_dataSheet))

	str_connectionString = "Driver={iSeries Access ODBC Driver};System=sys01;Uid=sreerga;Pwd=Dec2127"
	'str_connectionString = "Driver={iSeries Access ODBC Driver};System=ALLIED01;Uid=sreerga;Pwd=Dec2127"
	obj_conn.open str_connectionString

	If (obj_conn.State = 1) Then
		Call func_reportStatus("PASS", "Database connection", "Database connection sucess")
	Else
		Call func_reportStatus("FAIL", "Database connection", "Database connection failed : "&err.description)
	End If 'If (obj_conn.State = 1) Then

	str_sqlQuery = str_query
	Set obj_resultSet = obj_conn.Execute(str_sqlQuery)
	
	If (err.number = 0) Then
		Call func_reportStatus("PASS", "DB query Execution Passed", str_sqlQuery)
	Else
		Call func_reportStatus("FAIL", "DB query Execution Failed : "&str_sqlQuery, err.description)
	End If 'If (err.number = 0) Then
	
	If (obj_resultSet.BOF = obj_resultSet.EOF) Then
		Call func_reportStatus("FAIL", "No data retrived for the query : "&str_sqlQuery, err.description)
	End If 'If (obj_resultSet.BOF = obj_resultSet.EOF) Then
	
	str_dataSheetname = Ucase(str_dataSheet)
	If ((str_dataSheetname <> "CSPOTEMP") And (str_dataSheetname <> "PAGECOUNT")) Then
		Datatable.Addsheet(str_dataSheetname)
	End If 'If ((str_dataSheetname <> "CSPOTEMP") And (str_dataSheetname <> "PAGECOUNT")) Then
	
	If (str_dataSheetname = "CUPCTBTMP") Then
		Do While Not obj_resultSet.EOF
			DataTable.Getsheet(str_dataSheetname).Addparameter Trim(obj_resultSet.Fields("FIELD_NAME").Value), Trim(obj_resultSet.Fields("FIELD_VALUE").Value)
			obj_resultSet.MoveNext()
		Loop 'Do While Not obj_resultSet.EOF
		
	ElseIf (str_dataSheetname = "CSPOTEMP") Then
		For each str_field in obj_resultSet.Fields
			Environment.Value("CSPOTemp") = Trim(str_field.value)
		Next 'For each str_field in obj_resultSet.Fields
		
	ElseIf (str_dataSheetname = "PAGECOUNT") Then
		For each str_field in obj_resultSet.Fields
			If (Trim(str_field.value) Mod 5 = 0) Then
				Environment.Value("BIGDS024PageCount") = (Trim(str_field.value)/5)
			Else
				Environment.Value("BIGDS024PageCount") = (Trim(str_field.value)/5) + 1
			End If 'If (Trim(str_field.value) Mod 5 = 0) Then
		Next 'For each str_field in obj_resultSet.Fields
		
	ElseIf (str_dataSheetname = "CSPONUMBER") Then
		Set obj_TempDataSheet = Datatable.GetSheet("CSPONUMBER")
		Set obj_cspoNumber = obj_TempDataSheet.Addparameter("URURNO","")
		
		Do Until obj_resultSet.EOF
			int_tempRow = int_tempRow + 1
			DataTable.GetSheet("CSPONUMBER").SetCurrentRow(int_tempRow)
			For each str_field in obj_resultSet.Fields
				'obj_cspoNumber.value = Trim(str_field.value)
				DataTable.Value("URURNO", "CSPONUMBER") = Trim(str_field.value)
			Next 'For each str_field in obj_resultSet.Fields
			obj_resultSet.MoveNext
		Loop 'Do Until obj_resultSet.EOF
		
		Set obj_TempDataSheet = Nothing
		Set obj_cspoNumber = Nothing
		
	Else
		For each str_field in obj_resultSet.Fields
			If (Ucase(str_dataSheet) = "ACCOUNTINFO") Then
				If (Ucase(str_field.name) <> "COMPLTDATE") Then 
					DataTable.Getsheet(str_dataSheetname).Addparameter Trim(str_field.name), Trim(str_field.value)
				End If 'If (Ucase(str_field.name) <> "COMPLTDATE") Then 
			Else
				DataTable.Getsheet(str_dataSheetname).Addparameter Trim(str_field.name), Trim(str_field.value)
			End If' If (Ucase(str_dataSheet) = "ACCOUNTINFO") Then
		Next 'For each str_field in obj_resultSet.Fields
	End If 'If (str_dataSheetname = "CUPCTBTMP") Then

	obj_resultSet.Close
	obj_conn.Close
	
	Set obj_dataSheet = Nothing
	Set obj_conn = Nothing
	Set obj_resultSet = Nothing
End Function 'Function func_retrieveData(str_query, str_dataSheet)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_setScreenProperty(str_screenName)
'Parameters		: Screen Name whose property is to be changed
'Description	: Function changes the screen property for the current quote being processed.
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_setScreenProperty(str_screenName)
	Dim obj_screenProperty
	Set obj_screenProperty = TEWindow("InfoProWindow").TEScreen(str_screenName)
	If (str_screenName = "BIRC01_Route") Then
		obj_screenProperty.SetTOProperty "label", ".*/.*/.*Comp.*"&Trim(Environment.Value("DivisionNumber"))&".*"
	Else
		obj_screenProperty.SetTOProperty "label", ".*/.*/.*Company.*"&Trim(Environment.Value("DivisionNumber"))&".*"
	End If 'If (str_screenName = "BIRC01_Route") Then
	Set obj_screenProperty = Nothing
End Function 'Function func_setScreenProperty(str_screenName)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_SendKey(str_key)
'Parameters		: NA
'Description	: Function is used to send input key
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_SendKey(str_key)
	Dim obj_WShell
	Set obj_WShell = CreateObject("wscript.shell")
	
	Select Case str_key
		Case "ENTER"
			TEWindow("InfoProWindow").Activate
			obj_WShell.Sendkeys "{ENTER}"
		Case "SELECTION"
			obj_WShell.Sendkeys "+{TAB}"
			obj_WShell.Sendkeys "1"
			Wait(2)
			obj_WShell.Sendkeys "{ENTER}"
		Case "SELECT"
			obj_WShell.Sendkeys "1"
			Wait(2)
			obj_WShell.Sendkeys "{ENTER}"
		Case "PAGEUP"
			obj_WShell.Sendkeys "{PGUP}"
		Case "PAGEDOWN"
			obj_WShell.Sendkeys "{PGDN}"
		Case "MAXIMIZE"
			obj_WShell.Sendkeys "%  "
			obj_WShell.Sendkeys "+x"
		Case "F1"
			obj_WShell.Sendkeys "{F1}"
		Case "F2"
			obj_WShell.Sendkeys "{F2}"
		Case "F3"
			obj_WShell.Sendkeys "{F3}"
		Case "F4"
			obj_WShell.Sendkeys "{F4}"
		Case "F5"
			obj_WShell.Sendkeys "{F5}"
		Case "F6"
			obj_WShell.Sendkeys "{F6}"
		Case "F7"
			obj_WShell.Sendkeys "{F7}"
		Case "F8"
			obj_WShell.Sendkeys "{F8}"
		Case "F9"
			obj_WShell.Sendkeys "{F9}"
		Case "F10"
			obj_WShell.Sendkeys "{F10}"
		Case "F11"
			obj_WShell.Sendkeys "{F11}"
		Case "F12"
			obj_WShell.Sendkeys "{F12}"
	End Select 'Select Case str_key

	Set obj_WShell = NOTHING
End Function 'func_SendKey(str_key)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_getPageCount()
'Parameters		: NA
'Description	: Function is used to get the Page Count
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_getPageCount(str_Window, str_Screen, str_field)
	Dim int_PageCount
	For int_PageCount = 1 To 5
		If TEWindow(str_Window).TEScreen(str_Screen).TEField(str_field).Exist(5) Then
			Call func_SendKey("PAGEDOWN")
		Else
			func_getPageCount = int_PageCount
			Exit For
		End If 'If TEWindow(str_Window).TEScreen(str_Screen).TEField(str_field).Exist(5) Then
	Next 'For int_PageCount = 1 To 5
End Function 'func_getPageCount()
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_RegionSelection
'Parameters		: The region to be selected is used as a parameter
'Description	: Function is used to select the region
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_RegionSelection()
	Dim obj_fieldProperty
	Dim int_CountPage, int_PageCount, str_region
	
	str_region = "BIDBF"&Environment.Value("DivisionCode")
	
	Set obj_fieldProperty = TEWindow("InfoProWindow").TEScreen("Region").TEField("Region")
	obj_fieldProperty.SetTOProperty "text", str_region
	Set obj_fieldProperty = Nothing
	
	For int_PageCount = 1 To 2
		If (TEWindow("InfoProWindow").TEScreen("Region").TEField("Region").Exist(5)) Then
			TEWindow("InfoProWindow").TEScreen("Region").TEField("Region").SetCursorPos
			Call func_SendKey("SELECTION")
			Call func_reportStatus("PASS", "Region Selected sucessfully", str_region)
			Exit For
		ElseIf (TEWindow("InfoProWindow").TEScreen("Region").TEField("NextPage").Exist(5)) Then
			Call func_SendKey("PAGEDOWN")
		Else
			Call func_reportStatus("FAIL", "Region Does not exist", str_region)
		End If 'If (TEWindow("InfoProWindow").TEScreen("Region").TEField("Region").Exist(5)) Then
	Next 'For int_PageCount = 1 To 5
End Function 'Function func_RegionSelection()
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_DivisionSelection
'Parameters		: The division to be selected is used as a parameter
'Description	: Function is used to select the division
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_DivisionSelection(str_division)
	Dim int_CountPage, int_PageCount
	Dim obj_Property
	
	Set obj_Property = TEWindow("InfoProWindow").TEScreen("Division").TEField("Division")
	obj_Property.SetTOProperty "text", str_division
	Set obj_Property = Nothing
	
	For int_PageCount = 1 To 5
		If (TEWindow("InfoProWindow").TEScreen("Division").TEField("Division").Exist(5)) Then
			TEWindow("InfoProWindow").TEScreen("Division").TEField("Division").SetCursorPos
			Call func_SendKey("SELECTION")
			Call func_reportStatus("PASS", "Division Selected sucessfully", str_division)
			Exit For
		ElseIf (TEWindow("InfoProWindow").TEScreen("Division").TEField("NextPage").Exist(5)) Then
			Call func_SendKey("PAGEDOWN")
		Else
			Call func_reportStatus("FAIL", "Division Does not exist", str_division)
		End If 'For int_PageCount = 1 To 5
	Next 'For int_PageCount = 1 To 5
End Function 'Function func_DivisionSelection(str_division)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_PrimarySelection
'Parameters		: The primary selection to be selected is used as a parameter
'Description	: Function is used to select the primary selection
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_PrimarySelection(str_PrimarySelection)
	Dim int_PageCount
	For int_PageCount = 1 To 2
		If (TEWindow("InfoProWindow").TEScreen("PrimaryMenu").TEField(str_PrimarySelection).Exist(5)) Then
			TEWindow("InfoProWindow").TEScreen("PrimaryMenu").TEField(str_PrimarySelection).SetCursorPos
			Call func_SendKey("SELECTION")
			Call func_reportStatus("PASS", "Primary Selection Selected sucessfully", str_PrimarySelection)
			Exit For
		Else
			If int_PageCount = 1 Then
				Call func_SendKey("PAGEDOWN")
			Else
				Call func_reportStatus("FAIL", "Primary Selection Does not exist", str_PrimarySelection)	
			End If 'If int_PageCount = 1 Then
		End If 'If (TEWindow("InfoProWindow").TEScreen("PrimaryMenu").TEField(str_PrimarySelection).Exist(5)) Then
	Next 'For int_PageCount = 1 To 2
End Function 'Function func_PrimarySelection(str_PrimarySelection)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_SecondarySelection
'Parameters		: The secondary selection to be selected is used as a parameter
'Description	: Function is used to select the secondary selection
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_SecondrySelection(str_SecondarySelection)
	Dim int_PageCount, int_totalPageCount
	Dim str_cond1, str_cond2, str_cond3, str_cond4, str_cond5, str_cond6, str_cond7, str_cond8
	
	str_cond1 = ((UCASE(Environment.Value("PrimarySelection")) = "COMMODITYREBATEBILLING") OR (UCASE(Environment.Value("PrimarySelection")) = "CUSTOMERSERVICEWEBAPP"))
	str_cond2 = ((UCASE(Environment.Value("PrimarySelection")) = "DISPATCH") OR (UCASE(Environment.Value("PrimarySelection")) = "EODJOBS"))
	str_cond3 = ((UCASE(Environment.Value("PrimarySelection")) = "REGIONALINVOICINGCONTROLS") OR (UCASE(Environment.Value("PrimarySelection")) = "SALESINQUIRY"))
	
	
	str_cond4 = ((UCASE(Environment.Value("PrimarySelection")) = "CONTAINERINVENTORY") OR (UCASE(Environment.Value("PrimarySelection")) = "CUSTOMERMAINTENANCE"))
	str_cond5 = ((UCASE(Environment.Value("PrimarySelection")) = "CUSTOMERSERVICES") OR (UCASE(Environment.Value("PrimarySelection")) = "PRODUCTIONREPORTS"))
	str_cond6 = (UCASE(Environment.Value("PrimarySelection")) = "ROUTEMODEL")
	
	str_cond7 = ((UCASE(Environment.Value("PrimarySelection")) = "DIVISIONALINFORMATIONAUDIT") OR (UCASE(Environment.Value("PrimarySelection")) = "REGIONALCONTROLS"))
	str_cond8 = ((UCASE(Environment.Value("PrimarySelection")) = "ROUTINGSCHEDULING") OR (UCASE(Environment.Value("PrimarySelection")) = "VEHICLEMAINTENANCE"))
	
	
	If (str_cond1 OR str_cond2 OR str_cond3) Then
		int_totalPageCount = 1
	
	ElseIf (str_cond4 OR str_cond5 OR str_cond6) Then
		int_totalPageCount = 2
	
	ElseIf (str_cond7 OR str_cond8) Then
		int_totalPageCount = 3
	
	ElseIf (UCASE(Environment.Value("PrimarySelection")) = "DIVISIONALMANAGEMENTREPORT") Then
		int_totalPageCount = 4
	
	ElseIf (UCASE(Environment.Value("PrimarySelection")) = "SALESMANAGEMENT") Then
		int_totalPageCount = 5
	
	ElseIf (UCASE(Environment.Value("PrimarySelection")) = "TECHNICALCONTROLS") Then
		int_totalPageCount = 7
		
	ElseIf (UCASE(Environment.Value("PrimarySelection")) = "DIVISIONALCONTROLS") Then
		int_totalPageCount = 9
	Else
		Msgbox ("Invalid Selection")
		'"PRINTEDOUTPUT"
		'"TRUX"
	End If 'If (str_cond1 OR str_cond2 OR str_cond3) Then
	
	For int_PageCount = 1 To int_totalPageCount
		If (TEWindow("InfoProWindow").TEScreen(Environment.Value("PrimarySelection")).TEField(str_SecondarySelection).Exist(5)) Then
			TEWindow("InfoProWindow").TEScreen(Environment.Value("PrimarySelection")).TEField(str_SecondarySelection).SetCursorPos
			Call func_SendKey("SELECTION")
			Call func_reportStatus("PASS", "Secondry Selection Selected sucessfully", str_SecondarySelection)
			Exit For
		Else
			If int_PageCount < int_totalPageCount Then
				Call func_SendKey("PAGEDOWN")
			Else
				Call func_reportStatus("FAIL", "Secondry Selection Does not exist", str_SecondarySelection)
			End If 'If int_PageCount < int_totalPageCount Then
		End If 'If (TEWindow("InfoProWindow").TEScreen(Environment.Value("PrimarySelection")).TEField(str_SecondarySelection).Exist(5)) Then
	Next 'For int_PageCount = 1 To int_totalPageCount
End Function 'Function func_SecondrySelection(str_SecondarySelection)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_inputData(str_screenName, str_inputFields)
'Parameters		: Screen name; Field and data for the field
'Description	: Function is used to input data into the application
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_inputData(str_screenName, str_inputFields)
	Dim arr_fields, arr_fieldData
	Dim int_field, int_fieldData, str_fieldvalue
	
	arr_fields = Split(str_inputFields, ";")
	
	For int_field = 0 To UBound(arr_fields)
		arr_fieldData = Split(arr_fields(int_field), ":")
		'Commented By Krishna
		'***************************************************************************
'		If TEWindow("InfoProWindow").TEScreen(str_screenName).TeField(Trim(arr_fieldData(0))).Exist(5) Then
'			str_fieldvalue = TEWindow("InfoProWindow").TEScreen(str_screenName).TeField(Trim(arr_fieldData(0))).GetROProperty("text")
'			'If (str_fieldvalue = "") Then
'				TEWindow("InfoProWindow").TEScreen(str_screenName).TeField(Trim(arr_fieldData(0))).Set Trim(arr_fieldData(1))
'			'Else
'				'Call func_reportStatus("WARNING", str_screenName, arr_fieldData(0) & "Field already has the value : "&str_fieldvalue)
'			'End If 'If (str_fieldvalue = "") Then
'		Else
'			Call func_reportStatus("WARNING", str_screenName, Trim(arr_fieldData(0)) & "Field does not exist")
'		End If 'If TEWindow("InfoProWindow").TEScreen(str_screenName).TeField(Trim(arr_fieldData(0))).Exist(5) Then
		'*******************************************************************************
		If TEWindow("InfoProWindow").TEScreen(str_screenName).TeField(Trim(arr_fieldData(0))).Exist(5) Then
			
			Call func_EnterValueInTeField(str_screenName,Trim(arr_fieldData(0)),Trim(arr_fieldData(1)))
				
		Else
			Call func_reportStatus("WARNING", str_screenName, Trim(arr_fieldData(0)) & "Field does not exist")
		End If
		
		
	Next 'For int_field = 0 to UBound(arr_fields)
	
End Function 'func_inputData(str_screenName, str_inputFields)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: Function func_compData(str_compString, str_dataSheetname)
'Parameters		: The fields which are to be compared and the datasheet in which the data from the database is present
'Description	: Function is used to compare data between the databases and the data present in the application
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_compData(str_screenName, str_comparionString, str_dataSheetName)
	Dim str_compString, str_dataSheet, str_screen
	Dim int_arrayCount, int_nameCount, str_address, str_zip, str_phoneNumber, str_name, str_appData,str_dbdata
	Dim str_appDateDay, str_appDateMonth, str_appDateYear
	Dim int_rate1, int_rate2, int_rate3
	Dim arr_compStringArray, arr_nameArray, arr_dateConvert
	
	str_compString = str_comparionString
	str_dataSheet = str_dataSheetName
	str_screen = str_screenName
	
	arr_compStringArray = Split(str_compString, ":")
	
	For int_arrayCount = 0 to UBound(arr_compStringArray)
		str_fieldName = arr_compStringArray(int_arrayCount)
		
		If ((str_fieldName = "BILL_STREET_1") Or (str_fieldName = "SVC_STREET_1")) Then
			If ((TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Address1").Exist(5)) AND (TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Address2").Exist(5)))Then
				Call func_reportStatus("PASS", str_screen, "Address field exists in the screen "&str_screen)
				str_address = TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Address1").GetROProperty("text") &" " 
				str_address = str_address & TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Address2").GetROProperty("text")
				
				If (str_screen = "BIGAA014") Then
					str_address = str_address & " " & TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Type").GetROProperty("text")
				End If 'If (str_screen = "BIGAA014") Then
			
				str_appData = Ucase(Trim(str_address))
				str_dbdata = Ucase(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
			Else
				Call func_reportStatus("WARNING", str_screen, "Address field does not exist in the screen "&str_screen)
			End If 'If ((TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Address1").Exist(5)) AND  (TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Address2").Exist(5)))Then
		
		ElseIf ((str_fieldName = "BILL_ZIP") Or (str_fieldName = "SVC_ZIP")) Then
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				
				If (str_screen = "BIGAA001") Then
					str_zip = Left(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text"), 5)
				ElseIf (str_screen = "BIGAA014") Then
					str_zip = Replace(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text"), "-", "+")
				End If 'If (str_screen = "BIGAA001") Then
				
				str_appData = Ucase(Trim(str_zip))
				str_dbdata = Ucase(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
			
			
		ElseIf ((str_fieldName = "BILL_PHONE") Or (str_fieldName = "SVC_PHONE")) Then
			If ((TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneAreaCode").Exist(5)) AND  (TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneNumber").Exist(5)))Then
				Call func_reportStatus("PASS", str_screen, "Phone Number field exists in the screen "&str_screen)
				
				If (str_screen = "BIGAA001") Then
					str_phoneNumber = TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneAreaCode").GetROProperty("text") &"-"
					str_phoneNumber = str_phoneNumber & TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneNumber").GetROProperty("text")
				ElseIf (str_screen = "BIGAA014") Then
					str_phoneNumber = TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneAreaCode").GetROProperty("text") &"-"
					str_phoneNumber = str_phoneNumber & Left(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneNumber").GetROProperty("text"),3) &"-"
					str_phoneNumber = str_phoneNumber & Right(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneNumber").GetROProperty("text"),4)
				End If 'If (str_screen = "BIGAA001") Then
				
				str_phoneNumber = Replace(str_phoneNumber,"-","")
				str_appData = Trim(str_phoneNumber)
				str_dbdata = Replace(Trim(DataTable.Value(str_fieldName, str_dataSheet)),"-","")
			Else
				Call func_reportStatus("WARNING", str_screen, "Phone Number field does not exist in the screen "&str_screen)
			End If 'If ((TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneAreaCode").Exist(5)) AND  (TEWindow("InfoProWindow").TEScreen(str_screen).TEField("PhoneNumber").Exist(5)))Then
		
		ElseIf (str_fieldName = "SVC_CUST_F_NAME;SVC_CUST_L_NAME") Then
			If TEWindow("InfoProWindow").TEScreen(str_screen).TEField("AccountName").Exist(5)Then
				Call func_reportStatus("PASS", str_screen, "Name field exists in the screen "&str_screen)
				arr_nameArray = Split(str_fieldName, ";")
				
				For int_nameCount = 0 to UBound(arr_nameArray)
					If (int_nameCount = 0) Then
						str_name = Ucase(Trim(DataTable.Value(arr_nameArray(int_nameCount), str_dataSheet)))
					Else
						str_name = str_name & " " & Ucase(Trim(DataTable.Value(arr_nameArray(int_nameCount), str_dataSheet)))
					End If 'If (int_nameCount = 0) Then
				Next 'For int_nameCount = 0 to UBound(arr_nameArray)
				
				str_appData = Ucase(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("AccountName").GetROProperty("text")))
				str_dbdata = str_name
			Else
				Call func_reportStatus("WARNING", str_screen, "Name field does not exist in the screen "&str_screen)
			End If 'If TEWindow("InfoProWindow").TEScreen(str_screen).TEField("AccountName").Exist(5)Then
		
		ElseIf (str_fieldName = "CUSTOMER_TYPE") Then
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				str_appData = Ucase(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text")))
				
				If (str_appData = "RESI") Then
					str_appData = "RESIDENTIAL"
				End If 'If (str_appData = "RESI") Then
				
				str_dbdata = Ucase(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
		
		ElseIf (str_fieldName = "ASSLNO") Then
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				
				str_appData = Left(Ucase(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text"))), 3)
				str_dbdata = Ucase(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
		
		ElseIf (str_fieldName = "REQ_START_DATE") Then
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				
				str_appData = Ucase(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text")))
				arr_dateConvert = Split(str_appData, "/")
				str_appDateDay = arr_dateConvert(1)
				str_appDateMonth = arr_dateConvert(0)
				str_appDateYear = arr_dateConvert(2)
				
				str_appData = "20"&str_appDateYear & "-" & str_appDateMonth & "-" & str_appDateDay
				str_dbdata = Ucase(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
		
		ElseIf (str_fieldName = "CG1_SIZE") Then
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				If (Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text")) = "") Then
					str_appData = Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text"))
				Else
					str_appData = CDbl(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text")))
				End If 'If (Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text")) <> "") Then
				
				If (Trim(DataTable.Value(str_fieldName, str_dataSheet)) = "") Then
					str_dbdata = Trim(DataTable.Value(str_fieldName, str_dataSheet))
				Else
					str_dbdata = CDbl(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
				End If 'If (Trim(DataTable.Value(str_fieldName, str_dataSheet)) = "") Then
				
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
			
		ElseIf (str_fieldName = "DELIVERY_NOTES") Then
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				str_appData = Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text"))
				str_appData = str_appData & " " & Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("DELIVERY_NOTES2").GetROProperty("text"))
				str_appData = str_appData & " " & Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("DELIVERY_NOTES3").GetROProperty("text"))
				str_appData = str_appData & " " & Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("DELIVERY_NOTES4").GetROProperty("text"))
				str_appData = str_appData & " " & Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("DELIVERY_NOTES5").GetROProperty("text"))
				str_appData = str_appData & " " & Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("DELIVERY_NOTES6").GetROProperty("text"))
				str_dbdata = Trim(DataTable.Value(str_fieldName, str_dataSheet))
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
			
		ElseIf (str_screen = "RateValidation") Then
			If ((str_fieldName = "Rate") Or (str_fieldName = "Rate2")) Then
				If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
					Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
					
					If ((Environment.Value("TERM") > 12) AND (str_fieldName = "Rate")) Then
						str_appData = Cstr(CDbl(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Rate2").GetROProperty("text"))))
						If Environment.Value("CHARGECODE") = "RES" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG1PC", "CUPCTBPRCRate")))
						ElseIf Environment.Value("CHARGECODE") = "REC" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG2PC", "CUPCTBPRCRate")))
						ElseIf Environment.Value("CHARGECODE") = "YAR" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG3PC", "CUPCTBPRCRate")))
						End If 'If Environment.Value("CHARGECODE") = "RES" Then
					
					ElseIf ((Environment.Value("TERM") > 12) AND (str_fieldName = "Rate2")) Then
						str_appData = Cstr(CDbl(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Rate").GetROProperty("text"))))
						If Environment.Value("CHARGECODE2") = "RES" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG1PC", "CUPCTBPRCRate")))
						ElseIf Environment.Value("CHARGECODE2") = "REC" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG2PC", "CUPCTBPRCRate")))
						ElseIf Environment.Value("CHARGECODE2") = "YAR" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG3PC", "CUPCTBPRCRate")))
						End If 'If Environment.Value("CHARGECODE2") = "RES" Then
					
					Else
						str_appData = Cstr(CDbl(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField("Rate").GetROProperty("text"))))
						If Environment.Value("CHARGECODE") = "RES" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG1PC", "CUPCTBPRCRate")))
						ElseIf Environment.Value("CHARGECODE") = "REC" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG2PC", "CUPCTBPRCRate")))
						ElseIf Environment.Value("CHARGECODE") = "YAR" Then
							int_rate3 = CDbl(Trim(DataTable.Value("C1CG3PC", "CUPCTBPRCRate")))
						End If 'If Environment.Value("CHARGECODE") = "RES" Then
					End If 'If ((Environment.Value("TERM") > 12) AND (str_fieldName = "Rate")) Then
					
					If (str_fieldName = "Rate") Then
						int_rate1 = CDbl(Trim(DataTable.Value("P2MY1PR", "CUPLINE")))
						int_rate2 = CDbl(Trim(DataTable.Value("P3MY1PR", "CUPDEPLINE")))
						str_dbdata = Cstr(CDbl((int_rate1 + int_rate2) * int_rate3 * 3))
						
					ElseIf (str_fieldName = "Rate2") Then
						int_rate1 = CDbl(Trim(DataTable.Value("P2MY2PR", "CUPLINE")))
						int_rate2 = CDbl(Trim(DataTable.Value("P3MY2PR", "CUPDEPLINE")))
						str_dbdata = Cstr(CDbl((int_rate1 + int_rate2) * int_rate3 * 3))
					End If 'If (str_fieldName = "Rate") Then
				Else
					Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
				End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
			End If 'If ((str_fieldName = "Rate") Or (str_fieldName = "Rate2")) Then
		
		Else
			If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
				Call func_reportStatus("PASS", str_screen, str_fieldName &" exists in the screen "&str_screen)
				str_appData = Ucase(Trim(TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).GetROProperty("text")))
				str_dbdata = Ucase(Trim(DataTable.Value(str_fieldName, str_dataSheet)))
			Else
				Call func_reportStatus("WARNING", str_screen, str_fieldName &" does not exist in the screen, "&str_screen)
			End If 'If (TEWindow("InfoProWindow").TEScreen(str_screen).TEField(str_fieldName).Exist(5)) Then
		End If 'If ((str_fieldName = "BILL_STREET_1") Or (str_fieldName = "SVC_STREET_1")) Then
		
		If (str_appData = str_dbdata) Then
			Call func_reportStatus("DONE", str_screen &" : "& str_fieldName &" Comparison Match","Data present in application: " & str_appData & ". Data present in DB: " & str_dbdata)
		Else
			Call func_reportStatus("WARNING", str_screen &" : "& str_fieldName &" Comparison Mismatch","Data present in application: " & str_appData & ". Data present in DB: " & str_dbdata)
		End If 'If (str_appData = str_dbdata) Then
	Next 'For int_arrayCount = 0 to UBound(arr_compStringArray)
	
End Function 'Function func_compData(str_screenName, str_comparionString, str_dataSheetName)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_setData(str_dataString, str_dataSheet)
'Parameters		: 
'Description	: 
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_setData(str_dataString, str_dataSheet, str_ColumnName)
	Dim str_dataSheetname, arr_dataString, str_ColName
	Dim int_rowCount, int_tempRow
	Dim obj_TempDataSheet, obj_addColumn
	
	str_dataSheetname = Ucase(str_dataSheet)
	str_ColName = Ucase(str_ColumnName)
	arr_dataString = Split(str_dataString, "/")
	
	Set obj_TempDataSheet = Datatable.GetSheet(str_dataSheetname)
	Set obj_addColumn = obj_TempDataSheet.Addparameter(str_ColName,"")
	
	For int_rowCount = 0 To UBound(arr_dataString)
		int_tempRow = int_tempRow + 1
		DataTable.GetSheet(str_dataSheet).SetCurrentRow(int_tempRow)
		DataTable.Value(str_ColName, str_dataSheetname) = arr_dataString(int_rowCount)
	Next 'For int_rowCount = 0 To UBound(arr_dataString)
	
	Set obj_TempDataSheet = Nothing
	Set obj_addColumn = Nothing
	
End Function 'Function func_retrieveData(str_query, str_dataSheet)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************

'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
'Function Name	: func_ValidateDelete(str_query)
'Parameters		: 
'Description	: 
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
Function func_ValidateDelete(str_query)
	Dim obj_conn, obj_resultSet
	Dim str_connectionString, str_sqlQuery, str_dataSheetname, str_field
	Dim obj_TempDataSheet, obj_cspoNumber
	
	Set obj_conn = CreateObject("ADODB.Connection")
	Set obj_resultSet = CreateObject("ADODB.Recordset")

	str_connectionString = "Driver={iSeries Access ODBC Driver};System=sys01;Uid=sreerga;Pwd=Dec2127"
	obj_conn.open str_connectionString

	If (obj_conn.State = 1) Then
		Call func_reportStatus("PASS", "Database connection", "Database connection sucess")
	Else
		Call func_reportStatus("FAIL", "Database connection", "Database connection failed : "&err.description)
	End If 'If (obj_conn.State = 1) Then

	str_sqlQuery = str_query
	Set obj_resultSet = obj_conn.Execute(str_sqlQuery)
	
	If (err.number = 0) Then
		Call func_reportStatus("PASS", "DB query Execution Passed", str_sqlQuery)
	Else
		Call func_reportStatus("FAIL", "DB query Execution Failed : "&str_sqlQuery, err.description)
	End If 'If (err.number = 0) Then
	
		For each str_field in obj_resultSet.Fields
			If (Trim(str_field.value) = "D") Then
				func_ValidateDelete = 1
			Else
				func_ValidateDelete = 0
			End If' If (Ucase(str_dataSheet) = "ACCOUNTINFO") Then
		Next 'For each str_field in obj_resultSet.Fields

	obj_resultSet.Close
	obj_conn.Close
	
	Set obj_conn = Nothing
	Set obj_resultSet = Nothing
End Function 'Function func_ValidateDelete(str_query, str_dataSheet)
'----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

'****************************************************************************************************************************************************************************************************
