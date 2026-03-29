package com.vendora.pfs.service;

import com.vendora.pfs.dto.partnership.DeliveryPartnershipRequest;
import com.vendora.pfs.dto.partnership.PartnershipApplicationResponse;
import com.vendora.pfs.dto.partnership.SupplierPartnershipRequest;

public interface PartnershipService {

    PartnershipApplicationResponse applySupplierPartnership(SupplierPartnershipRequest request);

    PartnershipApplicationResponse applyDeliveryPartnership(DeliveryPartnershipRequest request);

    PartnershipApplicationResponse getApplicationById(Long id);
}
