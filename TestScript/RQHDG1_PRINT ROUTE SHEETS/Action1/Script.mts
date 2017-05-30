

RepositoriesCollection.Add Environment.Value("RootPath") & "ObjectRepository\InforProOR.tsr"
'Environment.Value("Route") = "2001"
'Environment.Value("PrintFormat") = "C"
'Environment.Value("ActiveRouteDate") = "030717"

If Environment.Value("Route")="" Then
	strFilePath = Environment.Value("RootPath") & "DataSheet\CommonData.xls"
	Environment.Value("Route") = GetFieldValueFromExcel(strFilePath,"Route")
End If

If VerifyScreenHeader("PRINT ROUTE SHEETS")=False Then
	Call func_SetReturnCodeToZero()
End If
If Environment.Value("ActiveRouteDate")="" Then
	strDate = Date()
	arrDate = Split(strDate,"/")
	arrDate(0) = func_SetToMaxFieldLength(arrDate(0),2)	
	arrDate(1) = func_SetToMaxFieldLength(arrDate(1),2)	
	Environment.Value("ActiveRouteDate") = arrDate(0) & arrDate(1) & Right(Year(Now),2)
End If

'If TeWindow("InfoProWindow").TeScreen("RQHDG1_PrintRouteSheets").TeField("PrintRouteSheets").Exist(5) Then
'	Call func_reportStatus("Pass","Verify the 'Print Route Sheets' Screen","The 'Print Route Screen' is Available")
	Call func_EnterValueInTeField("RQHDG1_PrintRouteSheets","ActiveRouteDate",Environment.Value("ActiveRouteDate"))
	Call func_sendkey("ENTER")
	intRouteFieldID =  func_SearchItemInGrid(Environment.Value("Route"),0)
	If intRouteFieldID>0 Then
		Call func_reportStatus("Pass","Verify the Active Route '" & Environment.Value("Route") & "'","The Active Route '" & Environment.Value("Route") & "' is displayed")
		TeWindow("InfoProWindow").TeScreen("RQHDG1_PrintRouteSheets").TeField("field id:=" & intRouteFieldID).SetCursorPos
		Call func_sendkey("BACKTAB")
		Call func_sendkey(Environment.Value("PrintFormat"))
		Call func_sendkey("F10")
		wait(2)
	Else
		Call func_reportStatus("Fail","Verify the Active Route '" & Environment.Value("Route") & "'","The Active Route '" & Environment.Value("Route") & "' is NOT displayed")
	End If














