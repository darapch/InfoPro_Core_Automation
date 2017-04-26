
'Environment.Value("Route") = "2001"
'Environment.Value("PrintFormat") = "C"
'Environment.Value("ActiveRouteDate") = "030717"

If TeWindow("InfoProWindow").TeScreen("RQHDG1_PrintRouteSheets").TeField("PrintRouteSheets").Exist(5) Then
	Call func_reportStatus("Pass","Verify the 'Print Route Sheets' Screen","The 'Print Route Screen' is Available")
	Call func_EnterValueInTeField("RQHDG1_PrintRouteSheets","ActiveRouteDate","030717")
	Call func_sendkey("ENTER")
	intRouteFieldID =  func_SearchItemInGrid(Environment.Value("Route"))
	If intRouteFieldID>0 Then
		Call func_reportStatus("Pass","Verify the Active Route '" & Environment.Value("Route") & "'","The Active Route '" & Environment.Value("Route") & "' is displayed")
		TeWindow("InfoProWindow").TeScreen("RQHDG1_PrintRouteSheets").TeField("field id:=" & intRouteFieldID).SetCursorPos
		Call func_sendkey("BACKTAB")
		Call func_sendkey(Environment.Value("PrintFormat"))
		Call func_sendkey("F10")
	Else
		Call func_reportStatus("Fail","Verify the Active Route '" & Environment.Value("Route") & "'","The Active Route '" & Environment.Value("Route") & "' is NOT displayed")
	End If
Else
	Call func_reportStatus("Fail","Verify the 'Print Route Sheets' Screen","The 'Print Route Screen' is NOT Available")
End If













