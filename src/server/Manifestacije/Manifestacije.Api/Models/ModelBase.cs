﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Manifestacije.Api.Models;

public class ModelBase
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = default!;

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? CreatedByUserId { get; set; } = null;

    public DateTime UpdatedAtUtc { get; set; } = DateTime.UtcNow;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? UpdatedByUserId { get; set; } = null;

    public DateTime? DeletedAtUtc { get; set; } = null;

    [BsonRepresentation(BsonType.ObjectId)]
    public string? DeletedByUserId { get; set; } = null;
}