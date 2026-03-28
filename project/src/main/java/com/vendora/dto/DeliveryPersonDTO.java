package com.vendora.dto;


import com.vendora.model.DeliveryPerson;
import lombok.Data;

@Data
public class DeliveryPersonDTO {

    private Long id;
    private String userCode;
    private String name;
    private String email;
    private String phone;
    private String address;
    private String province;
    private String district;
    private String vehicleType;
    private String vehicleModel;
    private String licensePlate;
    private String status;

    public static DeliveryPersonDTO from(DeliveryPerson dp) {
        DeliveryPersonDTO dto = new DeliveryPersonDTO();
        dto.setId(dp.getId());
        dto.setUserCode(dp.getUserCode());
        dto.setName(dp.getName());
        dto.setEmail(dp.getEmail());
        dto.setPhone(dp.getPhone());
        dto.setAddress(dp.getAddress());
        dto.setProvince(dp.getProvince());
        dto.setDistrict(dp.getDistrict());
        dto.setVehicleType(dp.getVehicleType());
        dto.setVehicleModel(dp.getVehicleModel());
        dto.setLicensePlate(dp.getLicensePlate());
        dto.setStatus(dp.getStatus());
        return dto;
    }
}