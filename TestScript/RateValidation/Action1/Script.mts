Dim str_queryCUPDEPLINE, str_queryCUPCTBPRCRate
Dim str_rate1, str_rate2

str_rate1 = "Rate"
str_rate2 = "Rate2"

Call func_setScreenProperty("RateValidation")
Wait(2)

If (TEWindow("InfoProWindow").TEScreen("RateValidation").TEField("ContainerRateInfo").Exist(5)) Then
	If (TEWindow("InfoProWindow").TEScreen("RateValidation").TEField("Description").Exist(5)) Then
		If (Environment.Value("TERM") > 12) Then
			str_queryCUPDEPLINE = "SELECT P3MY1PR, P3MY2PR FROM CUFILE.CUPDEPLINE WHERE SHIPMENT_ID = '"&Environment.Value("ShipmentId")&"'"
			Environment.Value("CHARGECODE") = UCASE(Trim(TEWindow("InfoProWindow").TEScreen("RateValidation").TeField("ChargeCode2").GetROProperty("text")))
			Environment.Value("CHARGECODE2") = UCASE(Trim(TEWindow("InfoProWindow").TEScreen("RateValidation").TeField("ChargeCode").GetROProperty("text")))
		Else
			str_queryCUPDEPLINE = "SELECT P3MY1PR FROM CUFILE.CUPDEPLINE WHERE SHIPMENT_ID = '"&Environment.Value("ShipmentId")&"'"
			Environment.Value("CHARGECODE") = UCASE(Trim(TEWindow("InfoProWindow").TEScreen("RateValidation").TeField("ChargeCode").GetROProperty("text")))
		End If 'If (Environment.Value("TERM") > 12) Then

		If Environment.Value("CHARGECODE") = "RES" Then
			str_queryCUPCTBPRCRate = "SELECT C1CG1PC FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "

		ElseIf Environment.Value("CHARGECODE") = "REC" Then
			str_queryCUPCTBPRCRate = "SELECT C1CG2PC FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "

		ElseIf Environment.Value("CHARGECODE") = "YAR" Then
			str_queryCUPCTBPRCRate = "SELECT C1CG3PC FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "
		End If 'If Environment.Value("CHARGECODE") = "RES" Then

		str_queryCUPCTBPRCRate = str_queryCUPCTBPRCRate & "AND INDUSTRY_WEIGHT_CD = '"&Environment.Value("WeightCode")&"' "
		str_queryCUPCTBPRCRate = str_queryCUPCTBPRCRate & "AND PRODUCT_SKU_CODE = '"&Environment.Value("ITEM_CODE")&"'"
		Call func_retrieveData(str_queryCUPCTBPRCRate, "CUPCTBPRCRate")

		Call func_retrieveData(str_queryCUPDEPLINE, "CUPDEPLINE")

		Call func_compData("RateValidation", str_rate1, "")

		If (Environment.Value("TERM") > 12) Then
			If Environment.Value("CHARGECODE2") = "RES" Then
				str_queryCUPCTBPRCRate = "SELECT C1CG1PC FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "

			ElseIf Environment.Value("CHARGECODE2") = "REC" Then
				str_queryCUPCTBPRCRate = "SELECT C1CG2PC FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "

			ElseIf Environment.Value("CHARGECODE2") = "YAR" Then
				str_queryCUPCTBPRCRate = "SELECT C1CG3PC FROM CUFILE.CUPCTBPRC WHERE POSTAL_CODE = " &Environment.Value("ZipCode")& " "
			End If 'If Environment.Value("CHARGECODE") = "RES" Then

			str_queryCUPCTBPRCRate = str_queryCUPCTBPRCRate & "AND INDUSTRY_WEIGHT_CD = '"&Environment.Value("WeightCode")&"' "
			str_queryCUPCTBPRCRate = str_queryCUPCTBPRCRate & "AND PRODUCT_SKU_CODE = '"&Environment.Value("ITEM_CODE")&"'"
			Call func_retrieveData(str_queryCUPCTBPRCRate, "CUPCTBPRCRate")

			Call func_compData("RateValidation", str_rate2, "CUPDEPLINE")
		End If 'If (Environment.Value("TERM") > 12) Then

	Else
		Call func_reportFailureScreenshot()
		Call func_reportStatus("FAIL", "Rate Validation", "Rate description does not exist")
	End If 'If (TEWindow("InfoProWindow").TEScreen("RateValidation").TEField("Description").Exist(5)) Then
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "Rate Validation", "Rate Validation screen does not exist")
End If 'If (TEWindow("InfoProWindow").TEScreen("RateValidation").TEField("ContainerRateInfo").Exist(5)) Then