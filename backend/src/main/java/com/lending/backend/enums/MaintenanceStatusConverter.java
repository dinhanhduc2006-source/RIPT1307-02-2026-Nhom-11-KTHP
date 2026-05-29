package com.lending.backend.enums;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class MaintenanceStatusConverter implements AttributeConverter<MaintenanceStatus, String> {

    @Override
    public String convertToDatabaseColumn(MaintenanceStatus attribute) {
        if (attribute == null) {
            return null;
        }
        switch (attribute) {
            case AwaitingApproval:
                return "AwaitingApproval";
            case UnderRepair:
                return "UnderRepair";
            case Completed:
                return "Completed";
            default:
                throw new IllegalArgumentException("Unknown attribute: " + attribute);
        }
    }

    @Override
    public MaintenanceStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        switch (dbData.trim()) {
            case "Awaiting Approval":
            case "AwaitingApproval":
                return MaintenanceStatus.AwaitingApproval;
            case "Under Repair":
            case "UnderRepair":
                return MaintenanceStatus.UnderRepair;
            case "Completed":
                return MaintenanceStatus.Completed;
            default:
                throw new IllegalArgumentException("Unknown dbData: " + dbData);
        }
    }
}
