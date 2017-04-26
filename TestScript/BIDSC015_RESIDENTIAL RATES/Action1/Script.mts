Environment.Value("ContainerGroup")="1"
Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

If VerifyScreenHeader("RESIDENTIAL RATES") Then
	If TeWindow("InfoProWindow").TeScreen("BIDSC015_RESIDENTIAL RATES").TeField("NoRateAvailable").Exist(1) Then
		Call func_reportStatus("Fail","No Rows found for Rate Information","No Rows found for Rate Information")
		Call func_SetReturnCodeToZero()
	Else		
		If TeWindow("InfoProWindow").TeScreen("BIDSC015_RESIDENTIAL RATES").TeField("Rate Code").Exist(0) Then
			strRateCode = TeWindow("InfoProWindow").TeScreen("BIDSC015_RESIDENTIAL RATES").TeField("Rate Code").GetROProperty("text")
			Call func_reportStatus("Pass","Verify Residential Rate","The Container Group '" & Environment.Value("ContainerGroup") & "' has Rate Information with the code " & strRateCode)
		End If
	End If	
Else
	Call func_SetReturnCodeToZero()
End If



