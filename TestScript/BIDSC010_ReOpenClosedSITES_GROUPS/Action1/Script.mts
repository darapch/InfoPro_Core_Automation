Environment.Value("AccountNumber") = "7"
Environment.Value("Site") = "00001"
intSpaces = 7-Len(Trim(Environment.Value("AccountNumber")))
Environment.Value("AccountNumber") = Space(intSpaces) & Environment.Value("AccountNumber")


If TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("ReOPEN_SITES_GROUPS").Exist(5) Then
	Call func_reportStatus("Pass","Verify the 'RE-OPEN CLOSED SITES/GROUPS' screen","The 'RE-OPEN CLOSED SITES/GROUPS' screen is available")
	Call func_EnterValueInTeField("BIDSC010_ReopenSITES_Groups","Account",Environment.Value("AccountNumber"))
	Call func_EnterValueInTeField("BIDSC010_ReopenSITES_Groups","Site",Environment.Value("Site"))
	Call func_sendkey("ENTER")	
	intAccFieldID = 484 'func_SearchItemInGrid(Environment.Value("AccountNumber"))
	strAccNo = TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intAccFieldID).GetROProperty("text")
	If Environment.Value("AccountNumber")=strAccNo Then
		Call func_reportStatus("Pass","Search the Account '" & Environment.Value("AccountNumber") & "'","The Account '" & Environment.Value("AccountNumber") & "' is Found")
		intSiteFieldID = intAccFieldID+8
		intGroupFieldID = intAccFieldID+32
		intClosedFieldID = intAccFieldID+141
		strClosed = TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intClosedFieldID).GetROProperty("text")
		strSiteNo = Trim(TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intSiteFieldID).GetROProperty("text"))
		strGroup = Trim(TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intGroupFieldID).GetROProperty("text"))
		If strSiteNo=Environment.Value("Site") Then
			Call func_reportStatus("Pass","Search Site '" & Environment.Value("Site") & "'","The Site '" & Environment.Value("Site") & "' is Found")							
			Select Case UCase(Environment.Value("Purpose")) 
				Case "SITE"
					If Environment.Value("Site")=strSiteNo and strGroup="" Then	
						Call func_reportStatus("Pass","Search the Closed Site '" & Environment.Value("Site") & "'","The Closed Site '" & Environment.Value("Site") & "' is Found")					
						TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intSiteFieldID).SetCursorPos
						Call func_sendkey("BACKTAB")
						Call func_sendkey("O")
						Call func_sendkey("ENTER")
						If TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("Re-open of Site was successful").Exist(5) Then
							Call func_reportStatus("Pass","Verify the Re-Open Status for the Site '" & Environment.Value("Site") & "'","Re-open is successful for the Site '" & Environment.Value("Site") & "'")					
						Else
							Call func_reportStatus("Pass","Verify the Re-Open Status for the Site '" & Environment.Value("Site") & "'","Re-open is NOT successful for the Site '" & Environment.Value("Site") & "'")					
						End If
					Else
						Call func_reportStatus("Fail","Search the Closed Site '" & Environment.Value("Site") & "'","The Closed Site '" & Environment.Value("Site") & "' is NOT Found")					
					End If
				Case "CONTAINER"
					If Environment.Value("Site")=strSiteNo and strGroup="" Then	
						Call func_reportStatus("Fail","Pre-Requisite","Site must be re-opened first before the container group is re-opened")
					Else
						
					End If
				Case "BOTH"
			End Select
			Call func_reportStatus("Fail","Search Site '" & Environment.Value("Site") & "'","The Site '" & Environment.Value("Site") & "' is NOT Found")					
		End If	
			
		
		
		
	Else
		Call func_reportStatus("Fail","Search the Account '" & Environment.Value("AccountNumber") & "'","The Account '" & Environment.Value("AccountNumber") & "' is NOT Found")
	End If
Else
	Call func_reportStatus("Fail","Verify the 'RE-OPEN CLOSED SITES/GROUPS' screen","The 'RE-OPEN CLOSED SITES/GROUPS' screen is NOT available")
End If





	
	
If Environment.Value("ContainerGroupNo")<>"" Then
	arrContainerGroups = Split(Environment.Value("ContainerGroupNo"),",")
	intFieldID = 484	
	For intContGrp = 0 To UBound(arrContainerGroups)			
		intSiteFieldID = intFieldID+8
		intGroupFieldID = intFieldID+32
		intClosedFieldID = intFieldID+141			
		strGroup = Trim(TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intGroupFieldID).GetROProperty("text"))
		strSiteNo = Trim(TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intSiteFieldID).GetROProperty("text"))
		If Trim(strGroup)=Trim(arrContainerGroups(intContGrp)) and strSiteNo=Environment.Value("Site") Then
			Call func_reportStatus("Pass","Search the Container Group '" & arrContainerGroups(intContGrp) & "'","The Container Group '" & arrContainerGroups(intContGrp) & "' is Found")
			TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("field id:=" & intGroupFieldID).SetCursorPos
			Call func_sendkey("BACKTAB")
			Call func_sendkey("O")
			Call func_sendkey("ENTER")
			strContReOpenStatus = TeWindow("InfoProWindow").TeScreen("BIDSC010_ReopenSITES_Groups").TeField("StatusMsg").GetROProperty("text")
			If Trim(strContReOpenStatus)="Re-open of Container Group was successful." Then
				Call func_reportStatus("Pass","Verify Re-Open Status for the container '" & arrContainerGroups(intContGrp) & "'","Re-open of Container Group was successful.")
				Call func_EnterValueInTeField("BIDSC010_ReopenSITES_Groups","Account",Environment.Value("AccountNumber"))
				Call func_EnterValueInTeField("BIDSC010_ReopenSITES_Groups","Site",Environment.Value("Site"))
				Call func_sendkey("ENTER")
			Else
				Call func_reportStatus("Fail","Verify Re-Open Status for the container '" & arrContainerGroups(intContGrp) & "'",strContReOpenStatus)
'				intFieldID = intFieldID + 80
			End If
			
		Else
			Call func_reportStatus("Fail","Search the Container Group '" & arrContainerGroups(intContGrp) & "'","The Container Group '" & arrContainerGroups(intContGrp) & "' is NOT Found")
		End If
	Next
Else
	Call reportStatus("Warning","Enter Atleast 1 Container Group","Enter Atleast 1 Container Group")
End If
	

	
	


	
	
	
	Function func_FindElementInArray(arrArray,strArrayElement)
		intFountAt = -1
		For intIndex = 0 To UBound(arrArray)
			If arrArray(intIndex)=strArrayElement Then				
				intFountAt = intIndex
				Exit For	
			End If
		Next
		func_FindElementInArray = intFountAt
	End Function



