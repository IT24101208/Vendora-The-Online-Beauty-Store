package com.vendora.epic1.service;

import com.vendora.epic1.dto.auth.MessageResponse;
import com.vendora.epic1.dto.user.DeleteAccountRequest;
import com.vendora.epic1.dto.user.PermanentDeleteAccountRequest;
import com.vendora.epic1.dto.user.ProfileResponse;
import com.vendora.epic1.dto.user.UpdateProfileRequest;

public interface UserService {

    ProfileResponse getCurrentUserProfile();

    ProfileResponse updateProfile(UpdateProfileRequest request);

    MessageResponse deleteAccount(DeleteAccountRequest request);

    MessageResponse permanentDeleteAccount(PermanentDeleteAccountRequest request);
}
