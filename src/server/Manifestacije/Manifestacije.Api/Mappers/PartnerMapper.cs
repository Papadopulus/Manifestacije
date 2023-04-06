using Manifestacije.Api.Models;
using Riok.Mapperly.Abstractions;

namespace Manifestacije.Api.Mappers;

[Mapper]
public static partial class PartnerMapper
{
    public static partial PartnerPartial PartnerToPartnerPartial(Partner partner);
    public static partial Partner PartialPartnerToPartner(PartnerPartial partnerPartial);
    public static partial Partner PartnerUpdateRequestToPartner(PartnerUpdateRequest partnerUpdateRequest);
    public static partial Partner PartnerCreateRequestToPartner(PartnerCreateRequest partnerCreateRequest);
    public static partial PartnerViewResponse PartnerToViewResponsePartner(Partner partner);
    public static partial IEnumerable<PartnerViewResponse> PartnerToViewResponsePartnerEnumerable(
        IEnumerable<Partner> location);

}