On Error Resume Next

'Environment.Value("ContainerGroup")="1"

Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)

'Environment.Value("Purpose") = "smoke"

Select Case UCase(Environment.Value("Purpose"))
	Case "SMOKE"
		Call VerifyResidentialInformation("BIDSC014_RESIDENTIAL SERVICE INFORMATION","ContainerGroup",Environment.Value("ContainerGroup"))
End Select









