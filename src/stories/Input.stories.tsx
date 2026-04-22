import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../components/Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label:    { control: 'text' },
    hint:     { control: 'text' },
    error:    { control: 'text' },
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Workflow Name',
    placeholder: 'e.g. Invoice Approval Flow',
    hint: 'Used in reports and audit logs',
  },
};

export const WithValue: Story = {
  args: {
    label: 'Workflow Name',
    defaultValue: 'Employee Onboarding',
    hint: 'Used in reports and audit logs',
  },
};

export const WithError: Story = {
  args: {
    label: 'Trigger Condition',
    placeholder: 'Describe the trigger…',
    error: 'Please describe when this workflow starts',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Organisation ID',
    defaultValue: 'org_gp_7f3a2b1c',
    disabled: true,
    hint: 'Set at account creation — contact support to change',
  },
};

export const NoLabel: Story = {
  args: { placeholder: 'Search workflows…' },
};

export const AIPrompt: Story = {
  args: {
    placeholder: 'Describe your workflow in plain language…',
    defaultValue: 'When a new hire joins, send welcome email and provision tools',
  },
};
