
If TeWindow("InfoProWindow").TeScreen("BIDRS005").TeField("ScreenNameField").Exist(10) Then
	Call func_reportStatus("pass","Verify the screen BIDRS005","The Screen BIDRS005 is displayed")
	Call func_SendKey("ENTER")
	Call func_SendKey("F6")
	Call func_inputData("BIDRS005", Environment.Value("InputFields"))
'	func_EnterValueInTeField("BIDRS005","Route Number",Environment.Value("RouteNumber"))
'	func_EnterValueInTeField("BIDRS005","Route Description",Environment.Value("RouteDescription"))
'	func_EnterValueInTeField("BIDRS005","Format",Environment.Value("Format"))
'	func_EnterValueInTeField("BIDRS005","Route Type",Environment.Value("RouteType"))
'	func_EnterValueInTeField("BIDRS005","Revenue Dist",Environment.Value("RevenueDist"))
	Call func_SendKey("ENTER")
	wait(5)
	
	If NOT TeWindow("InfoProWindow").TeScreen("BIDRS005").TeField("Status Message").Exist(3) Then
		strNotEnoughHistory = "Not enough route history exists- F10 function is disabled"
		If TeWindow("InfoProWindow").TeScreen("BIDRS005").TeField("text:=" & strNotEnoughHistory).Exist(2) Then
			Call func_reportStatus("Fail", "Not enough route history exists", strNotEnoughHistory)	
		End If
	End If
	
Else
	Call func_reportStatus("fail","Verify the screen BIDRS005","The Screen BIDRS005 is NOT displayed")
End If



TeWindow("InfoProWindow").TeScreen("BIDRS005").TeField("Status Message").Set

