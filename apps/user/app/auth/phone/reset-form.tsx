import useGlobalStore from '@/config/use-global';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button } from '@workspace/ui/components/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@workspace/ui/components/form';
import { Input } from '@workspace/ui/components/input';
import { AreaCodeSelect } from '@workspace/ui/custom-components/area-code-select';
import { useTranslations } from 'next-intl';
import { Dispatch, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import SendCode from '../send-code';
import CloudFlareTurnstile from '../turnstile';

export default function ResetForm({
  loading,
  onSubmit,
  initialValues,
  onSwitchForm,
}: {
  loading?: boolean;
  onSubmit: (data: any) => void;
  initialValues: any;
  setInitialValues: Dispatch<SetStateAction<any>>;
  onSwitchForm: Dispatch<SetStateAction<'register' | 'reset' | 'login'>>;
}) {
  const t = useTranslations('auth.reset');

  const { common } = useGlobalStore();
  const { verify, auth } = common;

  const [targetDate, setTargetDate] = useState<number>();

  const formSchema = z.object({
    telephone_area_code: z.string(),
    telephone: z.string(),
    password: z.string(),
    code: auth?.email?.email_enable_verify ? z.string() : z.string().nullish(),
    cf_token:
      verify.enable_register_verify && verify.turnstile_site_key
        ? z.string()
        : z.string().nullish(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-6'>
          <FormField
            control={form.control}
            name='telephone'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className='flex'>
                    <FormField
                      control={form.control}
                      name='telephone_area_code'
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <AreaCodeSelect
                              simple
                              className='w-32 rounded-r-none border-r-0'
                              placeholder='Area code...'
                              value={field.value}
                              onChange={(value) => {
                                if (value.phone) {
                                  form.setValue('telephone_area_code', value.phone);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Input
                      className='rounded-l-none'
                      placeholder='Enter your telephone...'
                      type='tel'
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    disabled={loading}
                    placeholder='Enter your password...'
                    type='password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {auth?.email?.email_enable_verify && (
            <FormField
              control={form.control}
              name='code'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <Input
                        disabled={loading}
                        placeholder='Enter code...'
                        type='text'
                        {...field}
                        value={field.value as string}
                      />
                      <SendCode type='phone' params={form.getValues()} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          {verify.enable_reset_password_verify && (
            <FormField
              control={form.control}
              name='cf_token'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CloudFlareTurnstile id='reset' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <Button type='submit' disabled={loading}>
            {loading && <Icon icon='mdi:loading' className='animate-spin' />}
            {t('title')}
          </Button>
        </form>
      </Form>
      <div className='mt-4 text-right text-sm'>
        {t('existingAccount')}&nbsp;
        <Button
          variant='link'
          className='p-0'
          onClick={() => {
            onSwitchForm('login');
          }}
        >
          {t('switchToLogin')}
        </Button>
      </div>
    </>
  );
}
