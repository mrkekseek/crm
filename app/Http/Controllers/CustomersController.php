<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Customers;
use App\Teams;
use App\CustomersComments;
use App\Users;
use Illuminate\Support\Facades\Validator;



class CustomersController extends Controller
{
    public function get($post = [])
    {
        $team = Teams::find(session('current_team'));
        $customer = ! empty($post['customer_id']) ? $team->customers()->wherePivot('customer_id', $post['customer_id'])->first() : [];
        if ( ! empty($customer))
        {
            $customer->users_ids = $customer->users()->get()->pluck('users_id')->toArray();
        }

        return $customer;
    }

    public function getList()
    {
        $team = Teams::find(session('current_team'));
        $customers = $team->customers()->get();

        foreach ($customers as $customer)
        {
            $customer->users_ids = $customer->users()->get()->pluck('users_id')->toArray();
        }

        return $customers;
    }

	public function save($post = [])
	{
        $validator = Validator::make(
            [
                'company_name' => (isset($post['company_name'])) ? $post['company_name'] : NULL,
                'contact_person' => (isset($post['contact_person'])) ? $post['contact_person'] : NULL,
                'phone_number' => (isset($post['phone_number'])) ? $post['phone_number'] : NULL,
                'extra_phone_number' => (isset($post['extra_phone_number'])) ? $post['extra_phone_number'] : NULL,
                'email' => (isset($post['email'])) ? $post['email'] : NULL,
                'extra_email' => (isset($post['extra_email'])) ? $post['extra_email'] : NULL,
                'nip' => (isset($post['nip'])) ? $post['nip'] : NULL,
                'bank_account' => (isset($post['bank_account'])) ? $post['bank_account'] : NULL,
                'website' => (isset($post['website'])) ? $post['website'] : NULL,
                'fb_link' => (isset($post['fb_link'])) ? $post['fb_link'] : NULL,
                'invoice_post_code' => (isset($post['invoice_post_code'])) ? $post['invoice_post_code'] : NULL,
                'invoice_street' => (isset($post['invoice_street'])) ? $post['invoice_street'] : NULL,
                'invoice_town' => (isset($post['invoice_town'])) ? $post['invoice_town'] : NULL,
                'invoice_province' => (isset($post['send_province'])) ? $post['send_province'] : NULL,
                'invoice_post_code' => (isset($post['invoice_post_code'])) ? $post['invoice_post_code'] : NULL,
                'invoice_region' => (isset($post['invoice_region'])) ? $post['invoice_region'] : NULL,
                'send_street' => (isset($post['send_street'])) ? $post['send_street'] : NULL,
                'send_province' => (isset($post['send_province'])) ? $post['send_province'] : NULL,
                'send_post_code' => (isset($post['send_post_code'])) ? $post['send_post_code'] : NULL,
                'send_region' => (isset($post['send_region'])) ? $post['send_region'] : NULL,
                'description' => (isset($post['description'])) ? $post['description'] : NULL,
                'customer_type' => (isset($post['customer_type'])) ? $post['customer_type'] : NULL
            ],
            [
                'company_name' => 'max:255',
                'contact_person' => 'max:255',
                //'phone_number' => 'required|min:11|numeric',
                //'extra_phone_number' => 'min:11|numeric',
                //'email' => 'email',
                //'extra_email' => 'email',
                'nip' => 'max:20',
                'bank_account' => 'max:25',
                'website' => 'max:35',
                'fb_link' => 'max:35',
                'invoice_post_code' => 'max:10',
                'invoice_street' => 'max:35',
                'invoice_town' => 'max:35',
                'invoice_province' => 'max:35',
                'invoice_post_code' => 'max:35',
                'invoice_region' => 'max:35',
                'send_street' => 'max:35',
                'send_province' => 'max:35',
                'send_post_code' => 'max:35',
                'send_region' => 'max:35',
                'description' => 'max:35',
                'customer_type' => 'max:35'
            ]
        );

        //dd($validator->errors()->all());
        if($validator->errors()->all()){
            return $validator->errors()->all();
        }else{
            $duplicates =
            Customers::where('company_name', 'like', ! empty($post['company_name']) ? '%' . $post['company_name'] . '%' : false)
                ->orWhere('contact_person', 'like', ! empty($post['contact_person']) ? '%' . $post['contact_person'] . '%' : false)
                ->orWhere('phone_number', 'like', ! empty($post['phone_number']) ? '%' . $post['phone_number'] . '%' : false)
                ->orWhere('extra_phone_number', 'like', ! empty($post['extra_phone_number']) ? '%' . $post['extra_phone_number'] . '%' : false)
                ->orWhere('email', 'like', ! empty($post['email']) ? '%' . $post['email'] . '%' : false)
                ->orWhere('extra_email', 'like', ! empty($post['extra_email']) ? '%' . $post['extra_email'] . '%' : false)
                ->orWhere('nip', 'like', ! empty($post['nip']) ? '%' . $post['nip'] . '%' : false)
                ->orWhere('bank_account', 'like', ! empty($post['bank_account']) ? '%' . $post['bank_account'] . '%' : false)
                ->orWhere('website', 'like', ! empty($post['website']) ? '%' . $post['website'] . '%' : false)
                ->orWhere('fb_link', 'like', ! empty($post['fb_link']) ? '%' . $post['fb_link'] . '%' : false)
                ->get();

            if ($duplicates && ! empty($post['check']))
            {
                $this->message(__('Wykryto duplikat'), 'error');
                $duplicates->put('check', 0);
                return $duplicates;
            }
            else
            {
                $customer = Customers::firstOrNew(['customer_id' => empty($post['customer_id']) ? 0 : $post['customer_id']]);

                $customer->company_name = $post['company_name'];
                $customer->contact_person = empty($post['contact_person']) ? '' : $post['contact_person'];
                $customer->customer_type = empty($post['customer_type']) ? 0 : $post['customer_type'];
                $customer->phone_number = empty($post['phone_number']) ? 0 : $post['phone_number'];
                $customer->extra_phone_number = empty($post['extra_phone_number']) ? 0 : $post['extra_phone_number'];
                $customer->bank_account = empty($post['bank_account']) ? 0 : $post['bank_account'];
                $customer->nip = empty($post['nip']) ? '' : $post['nip'];
                $customer->email = empty($post['email']) ? '' : $post['email'];
                $customer->extra_email = empty($post['extra_email']) ? '' : $post['extra_email'];
                $customer->website = empty($post['website']) ? '' : $post['website'];
                $customer->fb_link =empty($post['fb_link']) ? '' : $post['fb_link'];
                $customer->invoice_street = empty($post['invoice_street']) ? '' : $post['invoice_street'];
                $customer->invoice_town = empty($post['invoice_town']) ? '' : $post['invoice_town'];
                $customer->invoice_province = empty($post['invoice_province']) ? '' : $post['invoice_province'];
                $customer->invoice_post_code = empty($post['invoice_post_code']) ? '' : $post['invoice_post_code'];
                $customer->invoice_region = empty($post['invoice_region']) ? '' : $post['invoice_region'];
                $customer->send_street = empty($post['send_street']) ? '' : $post['send_street'];
                $customer->send_town = empty($post['send_town']) ? '' : $post['send_town'];
                $customer->send_province = empty($post['send_province']) ? '' : $post['send_province'];
                $customer->send_post_code = empty($post['send_post_code']) ? '' : $post['send_post_code'];
                $customer->send_region = empty($post['send_region']) ? '' : $post['send_region'];
                $customer->description = empty($post['description']) ? '' : $post['description'];

                $customer->save();
                if ( ! empty($post['users_ids']))
                {
                    $customer->users()->sync($post['users_ids']);
                }
                else
                {
                    $customer->users()->sync(Auth::user()->users_id);
                }

                $customer->teams()->syncWithoutDetaching(session('current_team'));
                $this->message(__('Customer was successfully saved'), 'success');
                return $customer->customer_id;
            }
        }

	}

    public function delete($post = [])
    {
        $customer = Customers::find($post['customer_id']);
        $customer->teams()->detach(session('current_team'));
        $customer->delete();

        $this->message(__('Record was successfully deleted'), 'success');
    }

    public function addComment($post = [])
    {
        $user_id = Auth::user()->users_id;
        $author = Auth::user()->users_first_name . ' ' . Auth::user()->users_last_name;
        $customers_comments = new CustomersComments();

        $customers_comments->customer_id = $post['customer_id'];
        $customers_comments->teams_id = session('current_team');
        $customers_comments->users_id = $user_id;
        $customers_comments->author = $author;
        $customers_comments->comment_text = $post['comment_text'];

        $customers_comments->save();
    }

    public function getComment($post = [])
    {
        $customers_comments = CustomersComments::where([['customer_id', '=', $post['customer_id']], ['teams_id', '=', session('current_team')]])->get();

        return $customers_comments;
    }
}