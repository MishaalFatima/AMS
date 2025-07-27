<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;
    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
    protected $with = ['roles', 'permissions'];

    public $timestamps = false;

    protected $fillable = [
        'UserName','email','phone','role_id','img_uri','password',
    ];

    protected $appends = ['avatar_url'];

    protected $hidden = ['img_uri','password','remember_token'];

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->img_uri
            ? asset('storage/user/' . $this->img_uri)
            : null;
    }
}
