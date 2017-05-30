'Dim obj_routeProperty
'Dim str_date, arr_date
'Dim obj_WShell
'Dim int_routeNumber, str_routeCount, arr_routeCount, int_routeCount, int_routePageCount, int_lastPageRouteCount, int_routePerPage
'Dim int_pageCount, int_rowCount, int_routeFlag
'
'
'''****************
'Environment.Value("RoutingDate") = ""
'Environment.Value("Route") = ""
'''****************
'
''Call func_setScreenProperty("BIGRS033")
'
'If TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("CreateRoute").Exist(5) Then
'	Call func_reportStatus("PASS", "Create Active Routes/Audits screen exists", "")
'	
'	If (Environment.Value("RoutingDate") = "") Then
'		Select Case UCase(WeekDayName(WeekDay(Now)))
'			Case "MONDAY"
'				str_date = Date()-3
'			Case "SUNDAY"
'				str_date = Date()-2	
'			Case "WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","TUESDAY"
'				str_date = Date()-1
'		End Select
'	Else
'		str_date = Environment.Value("RoutingDate")
'	End If 'If (Environment.Value("RoutingDate") = "") Then
'	
'	Environment.Value("RoutingDate") = str_date
'	
'	arr_date = Split(str_date, "/")
'	arr_date(0) = func_SetToMaxFieldLength(arr_date(0),2)
'	arr_date(1) = func_SetToMaxFieldLength(arr_date(1),2)
'	str_date = arr_date(0) & arr_date(1) & Right(arr_date(2), 2)
'	
'	If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("Date").Exist(2)) Then
'		TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("Date").Set str_date
'		Call func_SendKey("F10")
'		Call func_reportStatus("PASS", "Date field exists", "Date: " & str_date & " entered")
'		Wait(2)
'		
'		Set obj_WShell = CreateObject("wscript.shell")
'		Set obj_routeProperty = TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route")
'		int_routeFlag = 0
'		
'		int_routeNumber = Environment.Value("Route")
'		
'		'obj_routeProperty.SetTOProperty "text", int_routeNumber
'		'obj_routeProperty.SetTOProperty "attached text", int_routeNumber&".*"
'		
'		str_routeCount = TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("RecordCount").Text
'		arr_routeCount = Split(str_routeCount, " ")
'		int_routeCount = CInt(Trim(arr_routeCount(2)))
'		
'		int_routePageCount = CInt(int_routeCount/16)
'		
'		If (int_routePageCount = 0) Then
'			int_routePageCount = 1
'		End If
'		
'		int_lastPageRouteCount = CInt(int_routeCount mod 16)
'		
'		For int_pageCount = 1 To int_routePageCount
'		'For int_pageCount = 1 To 3
'			If (int_lastPageRouteCount <> 0) AND (int_pageCount = int_routePageCount) Then
'				'int_routePerPage = int_lastPageRouteCount + 1
'				int_routePerPage = int_lastPageRouteCount
'			Else
'				int_routePerPage = 16
'			End If 'If (int_lastPageRouteCount <> 0) AND (int_pageCount = int_routePageCount) Then
'			
'			For int_rowCount = 1 To int_routePerPage
'			'For int_rowCount = 1 To 16
'				If (int_rowCount = 1) Then
'					obj_routeProperty.SetTOProperty "start row", 5
'				End If 'If (int_rowCount = 1) Then
'				
'				If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route").Text = int_routeNumber) Then
'					int_routeFlag = 1
'					Call func_reportStatus("PASS", "Route " & int_routeNumber & " exists", "")
'				Else
'					Wait(1)
'					TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route").SetCursorPos
'					obj_WShell.Sendkeys "BACKTAB"
'					obj_WShell.Sendkeys "N"
'					Wait(1)
'				End If 'If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("Route").Text = int_routeNumber) Then
'				obj_routeProperty.SetTOProperty "start row", 5 + int_rowCount
'			Next 'For int_rowCount = 1 To int_routePerPage
'			
'			If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("NextPage").Exist) Then
'				obj_WShell.Sendkeys "{PGDN}"
'			End If 'If (TEWindow("InfoProWindow").TEScreen("BIGRS033").TeField("NextPage").Exist) Then
'		Next 'For int_pageCount = 1 To int_routePageCount
'		
'		If (int_routeFlag = 1) Then
'			Call func_reportStatus("PASS", "Route " & int_routeNumber & " exists amd has been selected", "")
'			Call func_SendKey("F10")
'		Else
'			Call func_reportFailureScreenshot()
'			Call func_reportStatus("FAIL", "Route " & int_routeNumber & " was not found", "")
'		End If 'If (int_routeFlag = 1) Then
'		
'	Else
'		Call func_reportFailureScreenshot()
'		Call func_reportStatus("FAIL", "Date field does not exists", "")
'	End If 'If TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("CreateRoute").Exist(5) Then
'	
'	Set obj_WShell = Nothing
'	Set obj_screenProperty = Nothing
'	
'Else
'	Call func_reportFailureScreenshot()
'	Call func_reportStatus("FAIL", "Create Active Routes/Audits screen does not exists", "")
'End If 'If TEWindow("InfoProWindow").TEScreen("BIGRS033").TEField("CreateRoute").Exist(5) Then
'
'
'
'




Dim obj_routeProperty
Dim str_date, arr_date
Dim obj_WShell
Dim int_routeNumber, str_routeCount, arr_routeCount, int_routeCount, int_routePageCount, int_lastPageRouteCount, int_routePerPage
Dim int_pageCount, int_rowCount, int_routeFlag


''****************
'Environment.Value("RoutingDate") = ""
'Environment.Value("Route") = ""
'Environment.Value("ServiceType") = "CO"
''****************


'If Environment.Value("Route")="" Then
'	strFilePath = Environment.Value("RootPath") & "DataSheet\CommonData.xls"
'	Environment.Value("Route") = GetFieldValueFromExcel(strFilePath,"Route")
'	If Environment.Value("Route")="" Then
'		Call func_reportStatus("Pass","Route Input Error","Input the Route Number")
'		Call func_SetReturnCodeToZero()
'	End If
'End If
'
'If Environment.Value("RoutingDate")="" Then
'	'strFilePath = Environment.Value("RootPath") & "DataSheet\CommonData.xls"
'	'Environment.Value("Route") = GetFieldValueFromExcel(strFilePath,"Route")
'	intStartingNumber = CInt(Left(Environment.Value("Route"),1))
'	intDiff = intStartingNumber-(WeekDay(Now)-1)
'	strDate = Date+intDiff
'	Environment.Value("RoutingDate") = CDate(strDate)
'		Call func_reportStatus("Pass","Route Input Error","Input the Route Number")
'		Call func_SetReturnCodeToZero()
'	
'End If

'Call func_setScreenProperty("BIGRS033")

If VerifyScreenHeader("CREATE ACTIVE ROUTES/AUDITS")=False Then
	Call func_SetReturnCodeToZero()
End If
	
If (Environment.Value("RoutingDate") = "") Then
	Select Case UCase(WeekDayName(WeekDay(Now)))
		Case "MONDAY"
			str_date = Date()-3
		Case "SUNDAY"
			str_date = Date()-2	
		Case "WEDNESDAY","THURSDAY","FRIDAY","SATURDAY","TUESDAY"
			str_date = Date()-1
	End Select
	str_date = Trim(str_date)
	Environment.Value("RoutingDate") = Trim(str_date)
Else
	str_date = Environment.Value("RoutingDate")
End If 'If (Environment.Value("RoutingDate") = "") Then
	
'TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("Date").Set str_date
'Call func_sendkey("F10")
'wait(2)
	
arr_date = Split(str_date, "/")
arr_date(0) = func_SetToMaxFieldLength(arr_date(0),2)
arr_date(1) = func_SetToMaxFieldLength(arr_date(1),2)
str_date = arr_date(0) & arr_date(1) & Right(arr_date(2), 2)

TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("Date").Set str_date
Call func_SendKey("F10")
wait(2)

strDateFromInfo = TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("DateField").Text

If Datediff("d",CDate(Environment.Value("RoutingDate")),CDate(strDateFromInfo))<>0 Then
	Call func_reportStatus("Fail","Not Redirected to Date","Not Redirected to Date - " & Environment.Value("RoutingDate"))
	Call func_SetReturnCodeToZero()
End If

'*******************************************************
blnExecute = False
If blnExecute Then			
	strRouteFound="BeforeFound"
	For intRouteFieldID = 339 To 1539 Step 80
		intServTypeFieldID = intRouteFieldID+57
		If TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intRouteFieldID).Exist(1)=False Then
			Exit For
		End If
		strServType = Trim(TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intServTypeFieldID).Text)
		strRoute = Trim(TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intRouteFieldID).Text)
		
		TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intRouteFieldID).SetCursorPos
		Call func_SendKey("BACKTAB")
		wait(0.5)
		Call func_SendKey("N")
		
		If intRouteFieldID>=1539 and TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("text:=\+").Exist(1) Then
			intRouteFieldID = 259
			Call func_SendKey("PAGEDOWN")
			wait(2)
		End If
	Next
	
	While NOT (TeWindow("InfoProWindow").GetROProperty("emulator status")="Locked") 
		Call func_sendkey("PAGEUP")	
		wait(2)
	Wend
	
	Set obj=CreateObject("WScript.Shell")
	obj.SendKeys "^"
	wait(1)
	
	intServTypeFieldID = func_SearchItemInGrid(Environment.Value("ServiceType"),0)
	If intServTypeFieldID>0 Then
		TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intServTypeFieldID).SetCursorPos
		Call func_SendKey("BACKTAB")
		Call func_SendKey(Space(1))
		Call func_SendKey("F10")
		wait(2)
		strStatusMsg = TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("StatusMsg").Text
		If InStr(strStatusMsg,"has been selected - F3 to submit")>0 Then
			Call func_reportStatus("Pass","Verify the text 'F3 to submit'",strStatusMsg)
			Call func_SendKey("F3")
			If TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("text:=INFOPRO DEV TEAM").Exist Then
				Call func_reportStatus("Pass","Verify Submission","The Route Submitted Successfully")
			End If		
		Else
			Call func_reportStatus("Fail","Verify the text 'F3 to submit'",strStatusMsg)
		End If	
	Else
		Call func_SetReturnCodeToZero()
	End If
End If	
'*******************************************************



		
	blnRouteFound=False
	intExecutionFlow = 1
	For intRouteFieldID = 339 To 1539 Step 80		
		If TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intRouteFieldID).Exist(1)=False Then
			Exit For
		End If
		intServTypeFieldID = intRouteFieldID+57
		intStatusFieldID = intRouteFieldID-17
		intSelFieldID = intRouteFieldID-5
		strServType = Trim(TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intServTypeFieldID).Text)
		strRoute = Trim(TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intRouteFieldID).Text)
		strStatus = Trim(TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intStatusFieldID).Text)
		If strStatus="" Then							
			TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intSelFieldID).SetCursorPos
			If intExecutionFlow = 1 Then
				Call func_SendKey(" ")
				wait(0.5)
				intExecutionFlow = intExecutionFlow+1
				Environment.Value("Route") = strRoute
				Call func_reportStatus("Pass","Route Number","Route Number " & Environment.Value("Route") & " is found")
				blnRouteFound = True
			Else			
				Call func_SendKey("N")
				wait(0.5)
			End If
		End If
		If intRouteFieldID>=1539 and TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("text:=\+").Exist(1) Then
			intRouteFieldID = 259
			Call func_SendKey("PAGEDOWN")
			wait(2)
		End If
	Next
	If blnRouteFound Then
		Call func_SendKey("F10")
		wait(2)
		strStatusMsg = TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("StatusMsg").Text
		If InStr(strStatusMsg,"has been selected - F3 to submit")>0 Then
			Call func_reportStatus("Pass","Verify the text 'F3 to submit'",strStatusMsg)
			Call func_SendKey("F3")
			If TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("text:=INFOPRO DEV TEAM").Exist Then
				Call func_reportStatus("Pass","Verify Submission","The Route Submitted Successfully")
			End If		
		Else
			Call func_reportStatus("Fail","Verify the text 'F3 to submit'",strStatusMsg)
		End If
	Else
		Call func_reportStatus("Fail","Route Number","Route Number " & Environment.Value("Route") & " is NOT found")
		Call func_SetReturnCodeToZero()
	End If
'	While NOT (TeWindow("InfoProWindow").GetROProperty("emulator status")="Locked") 
'		Call func_sendkey("PAGEUP")	
'		wait(2)
'	Wend
'	
'	Set obj=CreateObject("WScript.Shell")
'	obj.SendKeys "^"
'	wait(1)
	
'	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"),0)
'	If intRouteFieldID>0 Then
'		Call func_reportStatus("Pass","Route Number","Route Number " & Environment.Value("Route") & " is found")
'		TeWindow("InfoProWindow").TeScreen("BIGRS033").TeField("field id:=" & intRouteFieldID).SetCursorPos
'		Call func_SendKey("BACKTAB")
'		Call func_SendKey(Space(1))
'		Call func_SendKey("F10")
'		wait(2)
'		strStatusMsg = TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("StatusMsg").Text
'		If InStr(strStatusMsg,"has been selected - F3 to submit")>0 Then
'			Call func_reportStatus("Pass","Verify the text 'F3 to submit'",strStatusMsg)
'			Call func_SendKey("F3")
'			If TeWindow("InfoProWindow").TeScreen("CommonScreen").TeField("text:=INFOPRO DEV TEAM").Exist Then
'				Call func_reportStatus("Pass","Verify Submission","The Route Submitted Successfully")
'			End If		
'		Else
'			Call func_reportStatus("Fail","Verify the text 'F3 to submit'",strStatusMsg)
'		End If	
'	Else
'		Call func_reportStatus("Fail","Route Number","Route Number " & Environment.Value("Route") & " is NOT found")
'		Call func_SetReturnCodeToZero()
'	End If


			

