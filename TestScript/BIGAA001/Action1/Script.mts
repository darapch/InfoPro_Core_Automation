Dim str_queryCUPHEADER
Dim str_accountName, str_address, str_city, str_state, str_zipcode, str_phone, str_custCategory
Dim str_chargeEnviroFee, str_chargeEnviroFeeCode, str_chargeFuelFee, str_chargeFuelFeeCode
Dim str_errorMessage
Dim str_compStringBIGA001, str_compStringPrintFee

str_accountName = "BILL_CUST_NAME"
str_address = "BILL_STREET_1"
str_city = "BILL_CITY"
str_state = "BILL_REGION"
str_zipcode = "BILL_ZIP"
str_phone = "BILL_PHONE"
str_custCategory = "CUSTOMER_TYPE"
str_compStringBIGA001 = str_accountName&":"&str_address&":"&str_city&":"&str_state&":"&str_zipcode&":"&str_phone&":"&str_custCategory

str_chargeEnviroFee = "TOTAL_ERF"
str_chargeFuelFee = "TOTAL_FRF"
str_compStringPrintFee = str_chargeEnviroFee&":"&str_chargeFuelFee

Call func_setScreenProperty("BIGAA001")

If (TEWindow("InfoProWindow").TEScreen("BIGAA001").TEField("CustomerContactInfo").Exist(5)) Then
	Call func_SendKey("F12")
	Wait(5)
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA001").TEField("CustomerContactInfo").Exist(5)) Then


str_queryCUPHEADER = "SELECT SHIPMENT_ID, BILL_CUST_NAME, BILL_STREET_1, BILL_CITY, BILL_REGION, BILL_ZIP, BILL_PHONE, CUSTOMER_TYPE, "
str_queryCUPHEADER = str_queryCUPHEADER & "TOTAL_ERF, TOTAL_FRF, ADMIN_FEE_APPLIES, "
str_queryCUPHEADER = str_queryCUPHEADER & "SVC_CUST_F_NAME, SVC_CUST_L_NAME, SVC_STREET_1, SVC_CITY, SVC_REGION, SVC_ZIP, SVC_PHONE, WEIGHT_CODE "
str_queryCUPHEADER = str_queryCUPHEADER & "FROM CUFILE.CUPHEADER WHERE ORDER_ID = "&Environment.Value("OrderNum")

Call func_retrieveData(str_queryCUPHEADER, "CUPHEADER")

Environment.Value("StreetName") = Ucase(Trim(DataTable.Value("BILL_STREET_1", "CUPHEADER")))
Environment.Value("ShipmentId") = Ucase(Trim(DataTable.Value("SHIPMENT_ID", "CUPHEADER")))
Environment.Value("ZipCode") = Left(Trim(DataTable.Value("SVC_ZIP", "CUPHEADER")), 5)
Environment.Value("WeightCode") = Ucase(Trim(DataTable.Value("WEIGHT_CODE", "CUPHEADER")))

If (TEWindow("InfoProWindow").TEScreen("BIGAA001").TEField("AccountInformation").Exist(5)) Then
	Call func_reportStatus("PASS", "Residential Service Info", "Residential Service Info Screen (BIGAA001) exists")

	If (Environment.Value("BIGAA001Fields") <> "") Then
		Call func_inputData("BIGAA001", Environment.Value("BIGAA001Fields"))
	End If 'If (Environment.Value("BIGAA001Fields") <> "") Then

	Call func_compData("BIGAA001", str_compStringBIGA001, "CUPHEADER")

	Call func_SendKey("ENTER")
	Wait(5)

	If TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("UpdateAddress").Exist(5) Then
		If TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("Resume").Exist(5) Then
			TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("Resume").Set "R"
		End If 'If TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("Resume").Exist(5) Then
		Call func_SendKey("ENTER")
		Wait(5)
	End If 'If TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("UpdateAddress").Exist(5) Then

	If TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("PrintFee").Exist(5) Then
		Call func_reportStatus("PASS", "Residential Service Info", "Print Fee screen exists")

		If (Environment.Value("BIGAA001PrintFeeFields") <> "") Then
			Call func_inputData("BIGAA001", Environment.Value("BIGAA001PrintFeeFields"))
		End If 'If (Environment.Value("BIGAA001PrintFeeFields") <> "") Then

		Call func_compData("BIGAA001", str_compStringPrintFee, "CUPHEADER")

		TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("PrintFee").SetCursorPos
		Call func_SendKey("ENTER")
		Wait(5)
	Else
		Call func_reportStatus("WARNING", "Residential Service Info", "Print Fee screen does not exist")
	End If 'If TEWindow("InfoProWindow").TEScreen("BIGAA001").TeField("PrintFee").Exist(2) Then

	If (TEWindow("InfoProWindow").TEScreen("BIGAA001").TEField("PressEnter").Exist(5)) Then
		Call func_SendKey("ENTER")
		Wait(5)
	End if 'If (TEWindow("InfoProWindow").TEScreen("BIGAA001").TEField("PressEnter").Exist(5)) Then

Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Residential Service Info", "Residential Service Info Screen (BIGAA001) does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA001").TEField("AccountInformation").Exist(5)) Then