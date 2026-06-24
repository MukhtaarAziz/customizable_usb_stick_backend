<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class IraqiPhoneNumber implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @param  Closure  $fail
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Remove any spaces or hyphens
        $phone = preg_replace('/[\s\-]/', '', $value);

        // Iraqi phone numbers patterns:
        // Korek: 0770-0773
        // Zain: 0790-0794
        // Asiacell: 0780-0784
        $pattern = '/^(\+964|0)(770|771|772|773|790|791|792|793|794|780|781|782|783|784)\d{7}$/';

        if (!preg_match($pattern, $phone)) {
            $fail('حقل :attribute يجب أن يكون رقم هاتف عراقي صحيح من مزودي الخدمة (كورك - زين - اسيا).')
                ->translate();
        }
    }
}
