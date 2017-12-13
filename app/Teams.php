<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Teams extends Model
{
    protected $primaryKey = 'teams_id';
    protected $fillable = ['teams_name'];

    public function users()
    {
    	return $this->belongsToMany('App\Users', 'users_teams', 'teams_id', 'users_id')->withPivot(['teams_leader', 'teams_invite', 'teams_approved']);
    }

    public function plugins()
    {
    	return $this->belongsToMany('App\Plugins', 'plugins_teams', 'teams_id', 'plugins_id');
    }

    public function customers()
    {
        return $this->belongsToMany('App\Customers', 'customers_teams', 'teams_id', 'customer_id');
    }

    public function finances()
    {
        return $this->belongsToMany('App\Finances', 'finances_teams', 'teams_id', 'finances_id');
    }

    public function financesRegistered()
    {
        return $this->belongsToMany('App\FinancesRegistered', 'finances_registered_teams', 'teams_id', 'registered_id');
    }

    public function tasks()
    {
        return $this->hasMany('App\TasksLists', 'teams_id')->orderBy('position');
    }

    public function descs()
    {
        return $this->hasMany('App\Descs', 'team_id');
    }

}
