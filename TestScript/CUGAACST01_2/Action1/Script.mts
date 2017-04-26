Dim str_primaryEmailBusiness, str_primaryEmailHome, str_primaryFaxAreaCode, str_primaryFaxNumber, str_primaryName
Dim str_primaryPhone1AreaCode, str_primaryPhone1Ext, str_primaryPhone1Number, str_primaryPhone1Type, str_primaryPhone2AreaCode
Dim str_primaryPhone2Ext, str_primaryPhone2Number, str_primaryPhone2Type, str_primaryRole, str_primaryTitle

Dim str_secondaryEmailBusiness, str_secondaryEmailHome, str_secondaryFaxAreaCode, str_secondaryFaxNumber, str_secondaryName
Dim str_secondaryPhone1AreaCode, str_secondaryPhone1Ext, str_secondaryPhone1Number, str_secondaryPhone1Type, str_secondaryPhone2AreaCode
Dim str_secondaryPhone2Ext, str_secondaryPhone2Number, str_secondaryPhone2Type, str_secondaryRole, str_secondaryTitle

Call func_setScreenProperty("CUGAACST01_2")

If (TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("CustomerContactInfo").Exist(5)) Then

	Call func_reportStatus("PASS", "CustomerContactInfo", "Customer Contact Info Screen (CUGAACST01_2) exists")

	str_primaryEmailBusiness = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryEmailBusiness").GetROProperty("text")
	str_primaryEmailHome = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryEmailHome").GetROProperty("text")
	str_primaryFaxAreaCode = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryFaxAreaCode").GetROProperty("text")
	str_primaryFaxNumber = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryFaxNumber").GetROProperty("text")
	str_primaryName = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryName").GetROProperty("text")
	str_primaryPhone1AreaCode = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone1AreaCode").GetROProperty("text")
	str_primaryPhone1Ext = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone1Ext").GetROProperty("text")
	str_primaryPhone1Number = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone1Number").GetROProperty("text")
	str_primaryPhone1Type = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone1Type").GetROProperty("text")
	str_primaryPhone2AreaCode = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone2AreaCode").GetROProperty("text")
	str_primaryPhone2Ext = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone2Ext").GetROProperty("text")
	str_primaryPhone2Number = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone2Number").GetROProperty("text")
	str_primaryPhone2Type = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryPhone2Type").GetROProperty("text")
	str_primaryRole = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryRole").GetROProperty("text")
	str_primaryTitle = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("PrimaryTitle").GetROProperty("text")
	str_secondaryEmailBusiness = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryEmailBusiness").GetROProperty("text")
	str_secondaryEmailHome = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryEmailHome").GetROProperty("text")
	str_secondaryFaxAreaCode = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryFaxAreaCode").GetROProperty("text")
	str_secondaryFaxNumber = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryFaxNumber").GetROProperty("text")
	str_secondaryName = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryName").GetROProperty("text")
	str_secondaryPhone1AreaCode = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone1AreaCode").GetROProperty("text")
	str_secondaryPhone1Ext = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone1Ext").GetROProperty("text")
	str_secondaryPhone1Number = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone1Number").GetROProperty("text")
	str_secondaryPhone1Type = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone1Type").GetROProperty("text")
	str_secondaryPhone2AreaCode = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone2AreaCode").GetROProperty("text")
	str_secondaryPhone2Ext = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone2Ext").GetROProperty("text")
	str_secondaryPhone2Number = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone2Number").GetROProperty("text")
	str_secondaryPhone2Type = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryPhone2Type").GetROProperty("text")
	str_secondaryRole = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryRole").GetROProperty("text")
	str_secondaryTitle = TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("SecondaryTitle").GetROProperty("text")

	Call func_SendKey("ENTER")
Else
	Call func_reportFailureScreenshot()
	Call func_reportStatus("FAIL", "CustomerContactInfo", "Customer Contact Info Screen (CUGAACST01_2) does not exists")
End If 'If (TEWindow("InfoProWindow").TEScreen("CUGAACST01_2").TEField("CustomerContactInfo").Exist(5)) Then