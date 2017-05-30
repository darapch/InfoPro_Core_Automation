Dim str_CSPOTempQuery, int_fieldCount, str_CSPOQuery
Dim str_CSPO, str_Ext, str_Lift, str_Rate, str_Sel, str_Date, str_tempDate, arr_tempDate, int_tempDateCount

On Error Resume Next
RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"
On Error GoTo 0
'Call func_setScreenProperty("BIDDS035")

Environment.Value("AccountNumber") = func_SetToMaxFieldLength(Environment.Value("AccountNumber"),7)
Environment.Value("DivisionNumber") = func_SetToMaxFieldLength(Environment.Value("DivisionNumber"),5)


str_CSPO = "URPONO"
str_Ext = "Ext"
str_Lift = "URLFTS"
str_Service = "URSERV"
str_Rate = "URROUT"
str_Sel = "URNOTF"
str_Date = "URPDAT"

'If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("CallInRequest").Exist(5)) Then
'	Call func_reportStatus("PASS", "Call-In Request", "Call-In Request Screen (BIDDS035) exists")
'	
'	str_CSPOTempQuery = "SELECT max(URURNO) as maxURURNO FROM CUFILE.BIPUR WHERE URACCT = " & Environment.Value("AccountNumber")
'	str_CSPOTempQuery = str_CSPOTempQuery & " AND URCOMP = " & Environment.Value("DivisionNumber") & " AND URSCHD <> 'D'"
'	Call func_retrieveData(str_CSPOTempQuery, "CSPOTemp")
'	
'	If (Environment.Value("BIDDS035Fields") <> "") Then
'		Environment.Value("arr_BIDDS035Fields") = split(Trim(DataTable.Value("Parameter1", "Global")), "/")
'	
'		For int_fieldCount = 0 To UBound(Environment.Value("arr_BIDDS035Fields"))
'			Call func_inputData("BIDDS035", Environment.Value("arr_BIDDS035Fields")(int_fieldCount))
'			Call func_SendKey("ENTER")
'			Wait(2)
'			
'			If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("URPDAT").Text = "") Then
'				If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("NoDate").Exist) Then
'					str_tempDate = Date() + 5
'					arr_tempDate = split(str_tempDate, "/")
'					For int_tempDateCount = 0 To UBound(arr_tempDate)
'						If int_tempDateCount = 0 Then
'							str_tempDate = arr_tempDate(int_tempDateCount)
'						ElseIf int_tempDateCount = 2 Then
'							str_tempDate = str_tempDate & Right(arr_tempDate(int_tempDateCount), 2)
'						Else
'							str_tempDate = str_tempDate & arr_tempDate(int_tempDateCount)
'						End If 'If int_tempDateCount = 0 Then
'					Next 'For int_tempDateCount = 0 To UBound(arr_tempDate)
'					
'					TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("URPDAT").Set str_tempDate
'					Call func_SendKey("ENTER")
'					Wait(2)
'				End If 'If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("NoDate").Exist) Then
'			Else
'				'Msgbox(TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("URPDAT").Text )
'				Call func_SendKey("ENTER")
'				Wait(2)
'			End If 'If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("URPDAT").Text = "") Then
'			
'			If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("URPDAT").Text <> "")  Then
'				'Call func_validateDate("BIDDS035", "URPDAT")
'			End If 'If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("URPDAT") <>  Then
'		Next 'For int_fieldCount = 0 To UBound(Environment.Value("arr_BIDDS035Fields"))
'	
'		str_CSPOQuery = "SELECT URURNO as URURNO FROM CUFILE.BIPUR WHERE URACCT = " & Environment.Value("AccountNumber")
'		str_CSPOQuery = str_CSPOQuery & " AND URCOMP = " & Environment.Value("DivisionNumber") & " AND URSCHD <> 'D' AND URURNO > " & Environment.Value("CSPOTemp")
'		Call func_retrieveData(str_CSPOQuery, "CSPONumber")
'	End If 'If (Environment.Value("BIDDS035Fields") <> "") Then
'
'Else
'	Call func_reportFailureScreenshot()
'	Call func_reportStatus("FAIL", "Call-In Request", "Call-In Request Screen (BIDDS035) does not exist")
'End If 'If (TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("CallInRequest").Exist(5)) Then




If VerifyScreenHeader("Call-In Request")=False Then
	Call func_SetReturnCodeToZero()
End If


Environment.Value("PO") = Right(Year(Now),2) & "_" & Day(Now) & "_" & Hour(Now) & "_" & Minute(Now) & "_" & Second(Now)
Environment.Value("Lifts") = "  1"
Environment.Value("Serv") = "REG"
Call func_EnterValueInTeField("BIDDS035","URPONO",Environment.Value("PO"))
Call func_EnterValueInTeField("BIDDS035","URLFTS",Environment.Value("Lifts"))
Call func_EnterValueInTeField("BIDDS035","URSERV",Environment.Value("Serv"))
TeWindow("InfoProWindow").TeScreen("BIDDS035").TeField("URSERV").Set Environment.Value("Serv")
Call func_sendkey("ENTER")

If TEWindow("InfoProWindow").TEScreen("BIDDS035").TEField("NoDate").Exist(3) Then
	str_tempDate = Date() + 5
	
	arr_tempDate = split(str_tempDate, "/")
	
	For int_tempDateCount = 0 To UBound(arr_tempDate)
		If int_tempDateCount = 0 Then
			str_tempDate = func_SetToMaxFieldLength(arr_tempDate(int_tempDateCount),2)
		ElseIf int_tempDateCount = 2 Then
			str_tempDate = str_tempDate & Right(arr_tempDate(int_tempDateCount), 2)
		Else
			str_tempDate = str_tempDate & func_SetToMaxFieldLength(arr_tempDate(int_tempDateCount),2)
		End If 'If int_tempDateCount = 0 Then
	Next 'For int 
End If

Call func_EnterValueInTeField("BIDDS035","URPDAT",str_tempDate)
Call func_sendkey("ENTER")

If func_SearchItemInGrid(Environment.Value("PO"),0)>0 Then
	Call func_reportStatus("Pass","Verify Call-In Request","The Call-In Request has been created")
	strQuery = "SELECT MAX(URURNO) as URURNO FROM CUFILE.BIPUR WHERE URACCT = '" & Environment.Value("AccountNumber") & "' AND URCOMP ='" & Environment.Value("DivisionNumber") & "' and URUSER = '" & UCase(Environment.Value("UName")) & "'"
	Call func_GetUniqueRecordFromDBData("SYS01",Environment.Value("UName"),Environment.Value("Password"),strQuery)
	Call func_reportStatus("Pass","UR Number",Environment.Value("URURNO"))	
	'Call SetEnvironmentVariableValue("URURNO",Environment.Value("URURNO"))
	Call SetFieldValueIntoExcel(Environment.Value("RootPath") & "DataSheet\CommonData.xls","URURNO",Environment.Value("URURNO"))
Else
	Call func_reportStatus("Fail","Verify Call-In Request","The Call-In Request has NOT been created")
	Call func_SetReturnCodeToZero()
End If








