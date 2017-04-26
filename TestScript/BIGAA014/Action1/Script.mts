Dim str_queryCUPCTBTMP, str_queryCUPLINE, str_queryCUPPAAPRO, str_queryCUPCTBPRC

Dim str_AccountName, str_Address, str_City, str_State, str_Zipcode, str_Phone
Dim str_Territory, str_SalesRep, str_Stop, str_RecurChgFreq, str_Rate, str_IdCode
Dim str_Term, str_CSADate
Dim str_CSANumber
Dim str_ContainerType, str_ContainerSize, str_Frequency2
Dim str_compStringCUPHEADER, str_compStringCUPCTBTMP, str_compStringCUPLINE, str_compStringCUPAAPRO, str_compStringCUPCTBPRC

str_AccountName = "SVC_CUST_F_NAME;SVC_CUST_L_NAME"
str_Address = "SVC_STREET_1"
str_City = "SVC_CITY"
str_State = "SVC_REGION"
str_Zipcode = "SVC_ZIP"
str_Phone = "SVC_PHONE"
str_compStringCUPHEADER = str_AccountName&":"&str_Address&":"&str_City&":"&str_State&":"&str_Zipcode&":"&str_Phone

str_Territory = "ASTERR"
str_SalesRep = "ASSLNO"

str_Stop = "ACSTCD"
str_RecurChgFreq = "ACRCFQ"
str_Rate = "ACRATT"
str_IdCode = "SDPCOD"
str_compStringCUPCTBTMP = str_Territory&":"&str_SalesRep&":"&str_Stop&":"&str_RecurChgFreq&":"&str_Rate&":"&str_IdCode

str_Term = "CONTRACT_LENGTH"
str_CSADate = "REQ_START_DATE"
str_compStringCUPLINE = str_Term&":"&str_CSADate

str_CSANumber = "PVARCHAR2"
str_compStringCUPAAPRO = str_CSANumber

str_ContainerType = "CG1_TYPE"
str_ContainerSize = "CG1_SIZE"
str_QuantityOnOrder = "MINIMUM_QTY_TIER"
str_Frequency2 = "CG1_LIFTS"
str_compStringCUPCTBPRC = str_ContainerType&":"&str_ContainerSize&":"&str_QuantityOnOrder&":"&str_Frequency2

Call func_SendKey("ENTER")
Wait(2)

Call func_setScreenProperty("BIGAA014")
str_queryCUPCTBTMP = "SELECT FIELD_NAME, FIELD_VALUE FROM CUFILE.CUPCTBTMP WHERE FIELD_NAME IN ('ASTERR', 'ASSLNO', 'ACSTCD', 'ACRCFQ', 'ACRATT', 'SDPCOD')"
str_queryCUPLINE = "SELECT ITEM_CODE, CONTRACT_LENGTH, REQ_START_DATE, QUANTITY, DELIVERY_NOTES, P2MY1PR, P2MY2PR FROM CUFILE.CUPLINE WHERE SHIPMENT_ID = '"&Environment.Value("ShipmentId")&"'"

Call func_retrieveData(str_queryCUPCTBTMP, "CUPCTBTMP")
Call func_retrieveData(str_queryCUPLINE, "CUPLINE")
Environment.Value("TERM") = Trim(DataTable.Value("CONTRACT_LENGTH", "CUPLINE"))
Environment.Value("ITEM_CODE") = Ucase(Trim(DataTable.Value("ITEM_CODE", "CUPLINE")))

str_queryCUPCTBPRC = "SELECT CG1_TYPE, CG1_SIZE, MINIMUM_QTY_TIER, CG1_LIFTS FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "
str_queryCUPCTBPRC = str_queryCUPCTBPRC & "AND INDUSTRY_WEIGHT_CD = '"&Environment.Value("WeightCode")&"' "
str_queryCUPCTBPRC = str_queryCUPCTBPRC & "AND PRODUCT_SKU_CODE = '"&Environment.Value("ITEM_CODE")&"'"
Call func_retrieveData(str_queryCUPCTBPRC, "CUPCTBPRC")

If (TEWindow("InfoProWindow").TEScreen("BIGAA014").TEField("ResidentialServiceInfo").Exist(5)) Then
	Call func_reportStatus("PASS", "Residential Service Info", "Residential Service Info Screen (BIGAA014) exists")

	If (Environment.Value("BIGAA014Fields") <> "") Then
		Call func_inputData("BIGAA014", Environment.Value("BIGAA014Fields"))
	End If 'If (Environment.Value("BIGAA014Fields") <> "") Then

	Call func_compData("BIGAA014", str_compStringCUPHEADER, "CUPHEADER")
	Call func_compData("BIGAA014", str_compStringCUPCTBTMP, "CUPCTBTMP")
	Call func_compData("BIGAA014", str_compStringCUPLINE, "CUPLINE")
	Call func_compData("BIGAA014", str_compStringCUPAAPRO, "ACCOUNTINFO")
	Call func_compData("BIGAA014", str_compStringCUPCTBPRC, "CUPCTBPRC")

	TEWindow("InfoProWindow").TEScreen("BIGAA014").TEField("ResidentialServiceInfo").SetCursorPos
	Call func_SendKey("ENTER")
	Wait(5)

	If TEWindow("InfoProWindow").TEScreen("BIGAA014").TeField("AddressEntered").Exist(5) Then
		TEWindow("InfoProWindow").TEScreen("BIGAA014").TeField("Resume").Set "R"
		Call func_SendKey("ENTER")
		Wait(5)
	End If 'If TEWindow("InfoProWindow").TEScreen("BIGAA014").TeField("AddressEntered").Exist(5) Then

	If (TEWindow("InfoProWindow").TEScreen("BIGAA014").TEField("PressEnter").Exist(5)) Then
		Call func_SendKey("ENTER")
		Wait(5)
	End if 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014").TEField("PressEnter").Exist(5)) Then

	If TEWindow("InfoProWindow").TEScreen("BIGAA014").TeField("AddressEntered").Exist(5) Then
		TEWindow("InfoProWindow").TEScreen("BIGAA014").TeField("Resume").Set "R"
		Call func_SendKey("ENTER")
		Wait(5)
	End If 'If TEWindow("InfoProWindow").TEScreen("BIGAA014").TeField("AddressEntered").Exist(5) Then

Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Residential Service Info", "Residential Service Info Screen (BIGAA014) does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("BIGAA014").TEField("ResidentialServiceInfo").Exist(5)) Then