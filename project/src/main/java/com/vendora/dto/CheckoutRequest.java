package com.vendora.cart.dto;

import com.vendora.cart.model.LocationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public class CheckoutRequest {

    @NotEmpty(message = "Please select at least one item")
    private List<Long> itemIds;

    @NotBlank(message = "Address is required")
    private String address;

    @NotNull(message = "Location type is required")
    private LocationType locationType;

    @NotBlank(message = "Payment method is required")
    private String paymentMethod;   // "COD" or "ONLINE"

    public List<Long> getItemIds() { return itemIds; }
    public void setItemIds(List<Long> itemIds) { this.itemIds = itemIds; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public LocationType getLocationType() { return locationType; }
    public void setLocationType(LocationType locationType) { this.locationType = locationType; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
