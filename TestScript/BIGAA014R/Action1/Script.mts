Call func_setScreenProperty("BIGAA014R")
Wait(2)

If (TEWindow("InfoProWindow").TEScreen("BIGAA014R").TEField("ContainerRateInfo").Exist(5)) Then
	Call func_reportStatus("PASS", "Container Rate Info", "Container Rate Info Screen exists")
	'Call func_compData("BIGAA014R", str_compStringDCQO, "CUPLINE")

	Call func_SendKey("ENTER")
	Wait(5)

	If (TEWindow("InfoProWindow").TEScreen("BIGAA014R").TEField("ZeroRateWarning").Exist(5)) Then
		Call func_SendKey("ENTER")
		Wait(5)
	End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014R").TEField("ZeroRateWarning").Exist(5)) Then

Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Container Rate Info", "Container Rate Info Screen does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014R").TEField("ContainerRateInfo").Exist(5)) Then

If (TEWindow("InfoProWindow").TEScreen("BIGAA014R").TEField("SalesTransactionDetails").Exist(5)) Then
	Call func_reportStatus("PASS", "Sales Transaction Details Window", "Sales Transaction Details Window Screen exists")
	'Call func_compData("BIGAA014R", str_compStringDCCO, "CUPLINE")

	Call func_SendKey("ENTER")
	Wait(5)

Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Sales Transaction Details Window", "Sales Transaction Details Window Screen does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014R").TEField("SalesTransactionDetails").Exist(5)) Then