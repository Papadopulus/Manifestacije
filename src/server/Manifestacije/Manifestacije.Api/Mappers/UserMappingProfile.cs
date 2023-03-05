﻿using AutoMapper;
using Manifestacije.Api.Contracts.Requests;
using Manifestacije.Api.Contracts.Responses;
using Manifestacije.Api.Models;

namespace Manifestacije.Api.Mappers;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        CreateMap<UserCreateRequest, User>();
        CreateMap<UserUpdateRequest, User>();
        
        CreateMap<User, UserViewResponse>();
    }
}