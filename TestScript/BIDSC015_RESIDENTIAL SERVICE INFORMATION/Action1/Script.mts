

If VerifyScreenHeader("RESIDENTIAL SERVICE INFORMATION")=False Then
	Call func_SetReturnCodeToZero()
End If
'Environment.Value("ContainerGroup") = "1"
'Environment.Value("Site") = "00001"
'Environment.Value("Purpose") = "SITEADDRESSVALIDATION"


Environment.Value("ContainerGroup") = func_SetToMaxFieldLength(Environment.Value("ContainerGroup"),2)



Select Case UCase(Environment.Value("Purpose"))
	Case "SMOKE"
		Call VerifyResidentialInformation("BIDSC015_ResidentialServiceInformation","ContainerGroup",Environment.Value("ContainerGroup"))
	Case "SITEADDRESSVALIDATION"
		Call VerifySiteAddressValidation()
End Select


Function VerifySiteAddressValidation()

	strOriginalSiteCity = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteCity").GetROProperty("text")
	strOriginalSiteName = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteName").GetROProperty("text")
	strOriginalSiteState = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteState").GetROProperty("text")
	strOriginalSiteStreetNo = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteStreetNumber").GetROProperty("text")
	strOriginalSiteZip = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteZipcode").GetROProperty("text")
	strOriginalSiteStreetName = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("StreetName").GetROProperty("text")
	
	
	Call func_reportStatus("Done", "Original Site Name", strOriginalSiteName)
	Call func_reportStatus("Done", "Original Site Street No", strOriginalSiteStreetNo)
	Call func_reportStatus("Done", "Original Site Street Name", strOriginalSiteStreetName)
	Call func_reportStatus("Done", "Original Site City", strOriginalSiteCity)
	Call func_reportStatus("Done", "Original Site State", strOriginalSiteState)
	Call func_reportStatus("Done", "Original Site Zip Code", strOriginalSiteZip)
	
	
	
	'Environment.Value("SiteName") = "ZZZZ"
	'Environment.Value("SiteCity") = "LOSANGELES"
	'
	'
	'Environment.Value("SiteNumber") = "00001"
	'Environment.Value("ContainerGroup") = "5"
	'Environment.Value("Status") = "ACTIVE"
	'Environment.Value("RootPath") = "C:\Users\darapch\Desktop\InfoPro_Residence_Just Hold For a While\"
	
	
	Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteName",Environment.Value("SiteName"))
	Call func_SendKey("ENTER")
	Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
	'LoadAndRunAction Environment.Value("RootPath") & "TestScript\BIDSC015_CONTAINER SELECTION SCREEN","Action1",oneIteration
	If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteName",Environment.Value("SiteName")) Then
		Call func_reportStatus("Pass","Change the Site Name from '" & strOriginalSiteName & "' to '" & Environment.Value("SiteName") & "'", "Site Name is changed to " & Environment.Value("SiteName"))			
		TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteName").Set ""
		Call func_SendKey("ENTER")
		
		If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteNameMustBeEntered").Exist(4) Then
			Call func_reportStatus("Pass","Delete the Site Name", "ERROR 'Site Name must be entered' is displayed")	
			Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteName",strOriginalSiteName)
			Call func_SendKey("ENTER")	
			Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")		
			If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteName",strOriginalSiteName) Then
				Call func_reportStatus("Pass","Replace the Name to its original value", "The Name is replaced to its Original Value " & strOriginalSiteName)	
			Else
				Call func_reportStatus("Fail","Replace the Name to its original value", "The Name is NOT replaced to its Original Value " & strOriginalSiteName)	
			End If
		Else
			Call func_reportStatus("Fail","Delete the Site Name", "ERROR 'Site Name must be entered' is NOT displayed")	
			ExitTest		
		End If
	Else
		Call func_reportStatus("Pass","Change the Site Name from '" & strOriginalSiteName & "' to '" & Environment.Value("SiteName") & "'", "Site Name is NOT changed to " & Environment.Value("SiteName"))			
	End If
	
	
	
	Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteStreetNumber","9999")
	Call func_SendKey("ENTER")
	If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("Address not on streets").Exist(2) Then
		Call func_reportStatus("Pass", "Change the street number to '9999'", "An error message is displayed, Address not on street")
		Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","RESUME","R")
		Call func_SendKey("ENTER")		
		Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
		If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteStreetNumber","9999") Then
			Call func_reportStatus("Pass", "Change the street number to '9999'", "Street Number Changed to '9999'")	
			TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteStreetNumber").Set ""
			Call func_SendKey("ENTER")
			If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("StreetNotFoundInCity").Exist(2) Then
				Call func_reportStatus("Pass", "Delete the street name", "The error message 'street not found in city (finance number)' is displayed")
				Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","RESUME","C")
				Call func_SendKey("ENTER")
				
				Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteStreetNumber",strOriginalSiteStreetNo)				
				Call func_SendKey("ENTER")
				Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
				If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteStreetNumber",strOriginalSiteStreetNo) Then
					Call func_reportStatus("Pass", "Replace the Street Number to its original value", "Replaced the Street Number to its original value " & strOriginalSiteStreetNo)
				Else
					Call func_reportStatus("Fail", "Replace the Street Number to its original value", "Not Replaced the Street Number to its original value " & strOriginalSiteStreetNo)
				End If
			Else
				Call func_reportStatus("Fail", "Delete the street name", "The error message 'street not found in city (finance number)' is NOT displayed")
			End If	
		Else
			Call func_reportStatus("Fail", "Change the street number to '9999'", "Street Number is NOT Changed to '9999'")
			
		End If
	Else
		Call func_reportStatus("Fail", "Change the street number to '9999'", "An error message 'Address not on street' is not displayed")
	End If
	
	
	
	Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteCity",Environment.Value("SiteCity"))
	Call func_SendKey("ENTER")
	
	intCorrectedAddrFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("Corrected Address").GetROProperty("field id")
	intToBeCorrectedCityFieldID = intCorrectedAddrFieldID + 160
	strToBeCorrectedCity = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("field id:=" & intToBeCorrectedCityFieldID).GetROProperty("text")
	Call func_SendKey("ENTER")
	Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
	If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteCity",strToBeCorrectedCity) Then
		Call func_reportStatus("Pass", "Verify City Corrected", "The city is corrected to '" & strToBeCorrectedCity & "'")
		TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteCity").Set ""
		Call func_SendKey("ENTER")
		If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("CityMustBeEntered").Exist(2) Then
			Call func_reportStatus("Pass", "Delete the city value", "Error message 'City must have a value please enter' is displayed")
			Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteCity",strOriginalSiteCity)
			Call func_SendKey("ENTER")
			Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")		
			If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteCity",strOriginalSiteCity) Then
				Call func_reportStatus("Pass", "Replace the City value to its original value", "Replaced the City value to its original value " & strOriginalSiteCity)
			Else
				Call func_reportStatus("Fail", "Replace the City value to its original value", "Not Replaced to its original value " & strOriginalSiteCity)
			End If
		Else
			Call func_reportStatus("Fail", "Delete the city value", "Error message 'City must have a value please enter' is NOT displayed")
		End If
	Else
		Call func_reportStatus("Fail", "Verify City Corrected", "The city is NOT corrected to '" & strToBeCorrectedCity & "'")
	End If
	
	
	
	Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","StreetName","abcd")
	Call func_SendKey("ENTER")
	If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("Street Name Not Found").Exist(2) Then
		Call func_reportStatus("Pass", "Change the street number to 'abcd'", "An error message is displayed, Street Name Not Found")
		Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","RESUME","R")
		Call func_SendKey("ENTER")
		Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
		If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","StreetName","ABCD") Then
			Call func_reportStatus("Pass", "Change the Street Name to 'ABCD'", "Street Name Changed to 'ABCD'")	
			TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("StreetName").Set ""
			Call func_SendKey("ENTER")	
			If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("AddressOrStreetNameRequired").Exist(2) Then
				Call func_reportStatus("Pass", "Delete the Street Name", "Error message 'Address Number or Street Name must be entered' is displayed")
				Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","StreetName",strOriginalSiteStreetName)
				Call func_SendKey("ENTER")
				Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
				If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","StreetName",strOriginalSiteStreetName) Then
					Call func_reportStatus("Pass", "Replace the Street Name to its original value", "Replaced the Street Name to its original value " & strOriginalSiteStreetName)
				Else
					Call func_reportStatus("Fail", "Replace the Street Name to its original value", "Not Replaced the Street Name to its original value " & strOriginalSiteStreetName)
				End If
			Else
				Call func_reportStatus("Fail", "Delete the Street Name", "Error message 'Address Number or Street Name must be entered' is NOT displayed")
			End If
		Else
			Call func_reportStatus("Fail", "Change the Street Name to 'ABCD'", "Street Name is NOT Changed to 'ABCD'")
			
		End If
	Else
		Call func_reportStatus("Fail", "Change the Street Name to 'ABCD'", "An error message 'Street Name Not Found' is not displayed")
	End If
	
	
	
	Environment.Value("SiteState") = "FL"
	Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteState",Environment.Value("SiteState"))
	Call func_SendKey("ENTER")
	intCorrectedAddrFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("Corrected Address").GetROProperty("field id")
	intToBeCorrectedStateField = intCorrectedAddrFieldID + 191
	strToBeCorrectedState = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("field id:=" & intToBeCorrectedStateField).GetROProperty("text")
	Call func_SendKey("ENTER")
	Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
	If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteState",strToBeCorrectedState) Then
		Call func_reportStatus("Pass", "Verify State Corrected", "The State is corrected to '" & strToBeCorrectedState & "'")
		TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteState").Set ""
		Call func_SendKey("ENTER")
		If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("EnterStateProvince").Exist(2) Then
			Call func_reportStatus("Pass", "Delete the State", "ERROR : Please enter a valid State or Province")
			Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteState",strOriginalSiteState)
			Call func_SendKey("ENTER")
			Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
			If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteState",strOriginalSiteState) Then
				Call func_reportStatus("Pass", "Replace the State to its original value", "Replaced the State to its original value " & strOriginalSiteState)
			Else
				Call func_reportStatus("Fail", "Replace the State to its original value", "Not Replaced to its original value " & strOriginalSiteState)
			End If
		Else
			Call func_reportStatus("Fail", "Delete the State", "ERROR 'Please enter a valid State or Province' is not displayed")
		End If
	Else
		Call func_reportStatus("Fail", "Verify State Corrected", "The State is NOT corrected to '" & strToBeCorrectedState & "'")
	End If
		
	
	
	'	Environment.Value("SiteZIP") = "90044-2999"
		Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteZipcode",Environment.Value("SiteZIP"))
		Call func_SendKey("ENTER")
		intCorrectedAddrFieldID = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("Corrected Address").GetROProperty("field id")
		intToBeCorrectedZIPField = intCorrectedAddrFieldID + 195
		strToBeCorrectedZIP = TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("field id:=" & intToBeCorrectedZIPField).GetROProperty("text")
		strToBeCorrectedZIP = Left(strToBeCorrectedZIP,5) & "-" & Right(strToBeCorrectedZIP,4)
		
		Call func_SendKey("ENTER")
		Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")
		If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteZipcode",strToBeCorrectedZIP) Then
			Call func_reportStatus("Pass", "Verify ZIP Corrected", "The ZIP is corrected to '" & strToBeCorrectedZIP & "'")
			TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("SiteZipcode").Set ""
			Call func_SendKey("ENTER")
			If TeWindow("InfoProWindow").TeScreen("BIDSC015_ResidentialServiceInformation").TeField("EnterPostalZIP").Exist(2) Then
				Call func_reportStatus("Pass", "Delete the ZIP", "ERROR : A postal/zip code is required. Please enter a value.")
				Call func_EnterValueInTeField("BIDSC015_ResidentialServiceInformation","SiteZipcode",strOriginalSiteZip)
				Call func_SendKey("ENTER")
				Call CallExternalAction("BIDSC015_CONTAINER SELECTION SCREEN","Action1")			
				If GetAndVerifyTeFieldValue("BIDSC015_ResidentialServiceInformation","SiteZipcode",strOriginalSiteZip) Then
					Call func_reportStatus("Pass", "Replace the ZIP to its original value", "Replaced the ZIP to its original value " & strOriginalSiteZip)
				Else
					Call func_reportStatus("Fail", "Replace the ZIP to its original value", "Not Replaced to its original value " & strOriginalSiteZip)
				End If
			Else
				Call func_reportStatus("Fail", "Delete the ZIP", "ERROR 'A postal/zip code is required. Please enter a value' is not displayed")
			End If
		Else
			Call func_reportStatus("Fail", "Verify ZIP Corrected", "The ZIP is NOT corrected to '" & strToBeCorrectedZIP & "'")
		End If


End Function






