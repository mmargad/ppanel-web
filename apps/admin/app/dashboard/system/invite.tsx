'use client';

import { getInviteConfig, updateInviteConfig } from '@/services/admin/system';
import { useQuery } from '@tanstack/react-query';
import { Label } from '@workspace/ui/components/label';
import { Switch } from '@workspace/ui/components/switch';
import { Table, TableBody, TableCell, TableRow } from '@workspace/ui/components/table';
import { EnhancedInput } from '@workspace/ui/custom-components/enhanced-input';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

export default function Invite() {
  const t = useTranslations('system.invite');

  const { data, refetch } = useQuery({
    queryKey: ['getInviteConfig'],
    queryFn: async () => {
      const { data } = await getInviteConfig();

      return data.data;
    },
  });

  async function updateConfig(key: string, value: unknown) {
    if (data?.[key] === value) return;
    try {
      await updateInviteConfig({
        ...data,
        [key]: value,
      } as API.InviteConfig);
      toast.success(t('saveSuccess'));
      refetch();
    } catch (error) {
      /* empty */
    }
  }

  return (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>
            <Label>{t('enableForcedInvite')}</Label>
            <p className='text-muted-foreground text-xs'>{t('enableForcedInviteDescription')}</p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.forced_invite}
              onCheckedChange={(checked) => {
                updateConfig('forced_invite', checked);
              }}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('inviteCommissionPercentage')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('inviteCommissionPercentageDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <EnhancedInput
              placeholder={t('inputPlaceholder')}
              value={data?.referral_percentage}
              type='number'
              min={0}
              max={100}
              suffix='%'
              onValueBlur={(value) => updateConfig('referral_percentage', value)}
            />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <Label>{t('commissionFirstTimeOnly')}</Label>
            <p className='text-muted-foreground text-xs'>
              {t('commissionFirstTimeOnlyDescription')}
            </p>
          </TableCell>
          <TableCell className='text-right'>
            <Switch
              checked={data?.only_first_purchase}
              onCheckedChange={(checked) => {
                updateConfig('only_first_purchase', checked);
              }}
            />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
