
'Environment.Value("ContainerGroup") = "2"
Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

If VerifyScreenHeader("CONTAINER RATE INFORMATION") Then
	If TeWindow("InfoProWindow").TeScreen("BIDSC014R_CONTAINER RATE INFORMATION").TeField("NoRateAvailable").Exist(1) Then
		Call func_reportStatus("Fail","No Rows found for Rate Information","No Rows found for Rate Information")
		Call func_SetReturnCodeToZero()
	Else		
		If GetAndVerifyTeFieldValue("BIDSC014R_CONTAINER RATE INFORMATION","ContainerGroup",Environment.Value("ContainerGroup")) Then
			Call func_reportStatus("Pass","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is available at 'CONTAINER RATE INFORMATION'")
		Else
			Call func_reportStatus("Fail","Verify Container Group","The Container Group '" & Environment.Value("ContainerGroup") & "' is NOT available at 'CONTAINER RATE INFORMATION'")
		End If
	End If	
Else
	Call func_SetReturnCodeToZero()
End If
