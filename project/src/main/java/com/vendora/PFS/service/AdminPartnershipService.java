package com.vendora.pfs.service;

import com.vendora.pfs.dto.partnership.PartnershipApplicationResponse;
import com.vendora.pfs.dto.partnership.ReviewPartnershipRequest;

import java.util.List;

public interface AdminPartnershipService {

    List<PartnershipApplicationResponse> getAllApplications();

    PartnershipApplicationResponse getApplicationById(Long applicationId);

    PartnershipApplicationResponse reviewApplication(Long applicationId, ReviewPartnershipRequest request);
}
