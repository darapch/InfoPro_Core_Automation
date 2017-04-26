


Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)
Environment.Value("Site") = func_SetToMaxFieldLength(Environment.Value("Site"),5)

If VerifyScreenHeader("CONTAINER SELECTION SCREEN") Then	
	Call func_reportStatus("Pass","Verify 'CONTAINER SELECTION SCREEN' screen","In the 'CONTAINER SELECTION SCREEN' screen")
	Call func_EnterValueInTeField("BIDSC002_CONTAINER SELECTION SCREEN","Container Group",Environment.Value("ContainerGroup"))
	Call func_sendkey("ENTER")
	intContainerGroupFieldID =  func_SearchItemInGrid(Environment.Value("ContainerGroup"),0)
	Call func_sendkey("BACKTAB")
	Call func_sendkey(UCase(Environment.Value("Action")))
	Call func_sendkey("ENTER")
Else
	Environment.Value("returncode") = 0
End If


