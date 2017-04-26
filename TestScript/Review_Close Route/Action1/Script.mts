

TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").SetTOProperty "text",Environment.Value("Route")

If TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").Exist(5) Then
	Call func_reportStatus("Pass", "Found the Route " & Environment.Value("Route"), "Found the Route " & Environment.Value("Route"))
	intFieldID  = TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").GetROProperty("field id")-15	
	
	If func_VerifyRouteStatus(Environment.Value("Route"),"ENDR",intFieldID) Then
		TeWindow("InfoProWindow").TeScreen("BIGDS001").TeField("Route").SetCursorPos
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_BACKTAB
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey "C"
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_ENTER
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_PF11
		TeWindow("InfoProWindow").TeScreen("BIGDS001").SendKey TE_PF11
		If func_VerifyRouteStatus(Environment.Value("Route"),"CLSE",intFieldID)=False Then			
			Call func_reportStatus("FAIL", "Verify Status","Review and Close has been done succussfully. The status : CLSE")
		End If
	Else
		Call func_reportFailureScreenshot()
		Call func_reportStatus("FAIL", "Verify Pre-Requisite Status","The status of the Route " & Environment.Value("Route") & " is not ENDR")
	End If		
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Open Route screen does not exist", "")
End If







