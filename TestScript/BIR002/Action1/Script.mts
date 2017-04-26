Call func_setScreenProperty("BIR002")

If TEWindow("InfoProWindow").TEScreen("BIR002").TEField("RouteReviewClose").Exist(5) Then
	Call func_reportStatus("PASS", "Route Review & Close screen exists", "")
	Call func_SendKey("F11")
	
	If TEWindow("InfoProWindow").TEScreen("BIR002").TEField("PostCloseConfirm").Exist(5) Then
		Call func_reportStatus("PASS", "Post and Close confirmation screen exists", "")
		Call func_SendKey("F11")	
	Else
		Call func_reportFailureScreenshot()
		Call func_reportStatus("FAIL", "Post and Close confirmation screen does not exists", "")
	End If 'If TEWindow("InfoProWindow").TEScreen("BIR002").TEField("PostCloseConfirm").Exist(5) Then
	
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Route Review & Close screen does not exists", "")
End If 'If TEWindow("InfoProWindow").TEScreen("BIR002").TEField("RouteReviewClose").Exist(5) Then
