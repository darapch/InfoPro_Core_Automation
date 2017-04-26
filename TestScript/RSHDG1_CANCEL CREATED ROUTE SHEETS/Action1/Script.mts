'Environment.Value("Route") = "2001"
'Environment.Value("PrintFormat") = "C"
'Environment.Value("ActiveRouteDate") = "030717"

If TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("CancelCreatedRouteSheets").Exist(5) Then
	Call func_reportStatus("Pass","Verify the 'Cancel Create Route Sheets' Screen","The 'Cancel Create Route Sheets' Screen is available")
	Call func_EnterValueInTeField("RSHDG1_CancelCreatedRouteSheets","EnterFormat",Environment.Value("PrintFormat"))
	Call func_EnterValueInTeField("RSHDG1_CancelCreatedRouteSheets","EnterDate",Environment.Value("ActiveRouteDate"))
	Call func_sendkey("ENTER")
	intRouteFieldID = func_SearchItemInGrid(Environment.Value("Route"))
	If intRouteFieldID>0 Then
		Call func_reportStatus("Pass","Verify the Active Route '" & Environment.Value("Route") & "'","The Active Route '" & Environment.Value("Route") & "' is available")
		TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("field id:=" & intRouteFieldID).setCursorPos
		Call func_sendkey("BACKTAB")
		Call func_sendkey("1")
		Call func_sendkey("F10")
		strReason = "DELETE ON " & Now()
		If TeWindow("InfoProWindow").TeScreen("RSHDG1_CancelCreatedRouteSheets").TeField("EnterReasonForDeletionLabel").Exist(5) Then
			Call func_reportStatus("Pass","Verify the 'Enter Reason For Deletion' Field","The 'Enter Reason For Deletion' Field is available")
			Call func_EnterValueInTeField("RSHDG1_CancelCreatedRouteSheets","EnterReasonForDeletion",strReason)
			Call func_sendkey("ENTER")
		Else
			Call func_reportStatus("Fail","Verify the 'Enter Reason For Deletion' Field","The 'Enter Reason For Deletion' Field is NOT available")
		End If
	Else
		Call func_reportStatus("Fail","Verify the Active Route '" & Environment.Value("Route") & "'","The Active Route '" & Environment.Value("Route") & "' is NOT available")
	End If
Else
	Call func_reportStatus("Fail","Verify the 'Cancel Create Route Sheets' Screen","The 'Cancel Create Route Sheets' Screen is NOT available")	
End If



