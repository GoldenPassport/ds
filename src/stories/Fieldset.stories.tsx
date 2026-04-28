import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Fieldset, Legend, FieldGroup, Field,
  Label, Description, FieldDivider,
} from '../components/Fieldset';
import { Input }      from '../components/Input';
import { Select }     from '../components/Select';
import { Textarea }   from '../components/Textarea';
import { Checkbox }   from '../components/Checkbox';
import { Toggle }     from '../components/Toggle';
import { RadioGroup } from '../components/RadioGroup';
import { Button }     from '../components/Button';
import { Card }       from '../components/Card';

const meta = {
  title: 'Forms/Fieldset',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Basic ─────────────────────────────────────────────────

export const Basic: Story = {
  name: 'Basic',
  render: () => {
    const [name,  setName]  = useState('');
    const [email, setEmail] = useState('');
    return (
      <div className="max-w-md">
        <Fieldset>
          <Legend>Personal information</Legend>
          <FieldGroup className="mt-4">
            <Field>
              <Label>Full name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" />
            </Field>
            <Field>
              <Label>Email address</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" />
              <Description>We'll only use this to send you account notifications.</Description>
            </Field>
          </FieldGroup>
        </Fieldset>
      </div>
    );
  },
};

// ── With select & textarea ────────────────────────────────

export const AllControls: Story = {
  name: 'All controls',
  render: () => {
    const [name,    setName]    = useState('');
    const [country, setCountry] = useState('au');
    const [bio,     setBio]     = useState('');
    const [notify,  setNotify]  = useState(true);
    return (
      <div className="max-w-md">
        <Fieldset>
          <Legend>Profile settings</Legend>
          <FieldGroup className="mt-4">
            <Field>
              <Label required>Display name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" />
            </Field>
            <Field>
              <Label>Country</Label>
              <Select
                variant="native"
                value={country}
                onChange={setCountry}
                options={[
                  { value: 'au', label: 'Australia'     },
                  { value: 'gb', label: 'United Kingdom' },
                  { value: 'us', label: 'United States'  },
                  { value: 'ca', label: 'Canada'         },
                ]}
              />
            </Field>
            <Field>
              <Label>Bio</Label>
              <Textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Tell us a little about yourself…"
                rows={3}
              />
              <Description>Brief description for your profile. Max 200 characters.</Description>
            </Field>
            <Field>
              <Label>Email notifications</Label>
              <Toggle checked={notify} onChange={setNotify} label="Send me product updates" />
            </Field>
          </FieldGroup>
        </Fieldset>
      </div>
    );
  },
};

// ── Horizontal layout ─────────────────────────────────────

export const Horizontal: Story = {
  name: 'Horizontal layout',
  render: () => {
    const [first, setFirst] = useState('');
    const [last,  setLast]  = useState('');
    const [email, setEmail] = useState('');
    return (
      <div className="max-w-2xl">
        <Fieldset>
          <Legend>Contact details</Legend>
          <FieldGroup className="mt-4">
            <Field layout="horizontal">
              <Label>First name</Label>
              <div className="sm:col-span-2">
                <Input value={first} onChange={e => setFirst(e.target.value)} placeholder="Alex" />
              </div>
            </Field>
            <Field layout="horizontal">
              <Label>Last name</Label>
              <div className="sm:col-span-2">
                <Input value={last} onChange={e => setLast(e.target.value)} placeholder="Morgan" />
              </div>
            </Field>
            <Field layout="horizontal">
              <Label>Email</Label>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" />
                <Description>Used for login and notifications.</Description>
              </div>
            </Field>
          </FieldGroup>
        </Fieldset>
      </div>
    );
  },
};

// ── Multiple sections ─────────────────────────────────────

export const MultipleSections: Story = {
  name: 'Multiple sections',
  render: () => {
    const [name,  setName]  = useState('');
    const [email, setEmail] = useState('');
    const [street, setStreet] = useState('');
    const [city,   setCity]   = useState('');
    const [plan,   setPlan]   = useState('pro');
    return (
      <div className="max-w-md flex flex-col gap-8">

        <Fieldset>
          <Legend>Account</Legend>
          <FieldGroup className="mt-4">
            <Field>
              <Label required>Full name</Label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" />
            </Field>
            <Field>
              <Label required>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@example.com" />
            </Field>
          </FieldGroup>
        </Fieldset>

        <FieldDivider />

        <Fieldset>
          <Legend>Billing address</Legend>
          <FieldGroup className="mt-4">
            <Field>
              <Label>Street</Label>
              <Input value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St" />
            </Field>
            <Field>
              <Label>City</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Sydney" />
            </Field>
          </FieldGroup>
        </Fieldset>

        <FieldDivider />

        <Fieldset>
          <Legend>Plan</Legend>
          <FieldGroup className="mt-4">
            <Field>
              <RadioGroup
                value={plan}
                onChange={setPlan}
                options={[
                  { value: 'starter', label: 'Starter',     description: 'Up to 5 projects' },
                  { value: 'pro',     label: 'Pro',          description: 'Unlimited projects' },
                  { value: 'team',    label: 'Team',         description: 'SSO + audit logs'  },
                ]}
              />
            </Field>
          </FieldGroup>
        </Fieldset>

      </div>
    );
  },
};

// ── With validation errors ────────────────────────────────

export const WithErrors: Story = {
  name: 'With validation errors',
  render: () => {
    const [name,  setName]  = useState('');
    const [email, setEmail] = useState('bad-email');
    const [submitted, setSubmitted] = useState(true);

    const nameErr  = submitted && !name  ? 'Full name is required'       : '';
    const emailErr = submitted && !email.includes('@') ? 'Enter a valid email address' : '';

    return (
      <div className="max-w-md">
        <Fieldset>
          <Legend>Create account</Legend>
          <FieldGroup className="mt-4">
            <Field>
              <Label required>Full name</Label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Morgan"
                error={nameErr}
              />
            </Field>
            <Field>
              <Label required>Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@example.com"
                error={emailErr}
              />
              {!emailErr && <Description>We'll send a confirmation link here.</Description>}
            </Field>
          </FieldGroup>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setSubmitted(false)}>Reset</Button>
            <Button variant="primary"   onClick={() => setSubmitted(true)}>Submit</Button>
          </div>
        </Fieldset>
      </div>
    );
  },
};

// ── Disabled ──────────────────────────────────────────────

export const Disabled: Story = {
  name: 'Disabled fieldset',
  render: () => (
    <div className="max-w-md">
      <Fieldset disabled>
        <Legend>Billing details</Legend>
        <Description className="mt-1 text-xs text-ink-500 dark:text-ink-300">
          Locked — upgrade your plan to edit billing information.
        </Description>
        <FieldGroup className="mt-4">
          <Field>
            <Label>Cardholder name</Label>
            <Input value="Alex Morgan" onChange={() => {}} />
          </Field>
          <Field>
            <Label>Country</Label>
            <Select
              variant="native"
              value="au"
              onChange={() => {}}
              options={[{ value: 'au', label: 'Australia' }]}
            />
          </Field>
          <Field>
            <Label>Receive receipts</Label>
            <Toggle checked label="Email me receipts" onChange={() => {}} />
          </Field>
        </FieldGroup>
      </Fieldset>
    </div>
  ),
};

// ── Inside a Card ─────────────────────────────────────────

export const InCard: Story = {
  name: 'Inside a Card',
  render: () => {
    const [name,  setName]  = useState('');
    const [email, setEmail] = useState('');
    const [agree, setAgree] = useState(false);
    return (
      <div className="max-w-md">
        <Card padding="lg">
          <Fieldset>
            <Legend>Get early access</Legend>
            <FieldGroup className="mt-5">
              <Field>
                <Label required>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Alex Morgan" />
              </Field>
              <Field>
                <Label required>Work email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="alex@company.com" />
              </Field>
              <Field>
                <Checkbox
                  checked={agree}
                  onChange={setAgree}
                  label="I agree to the terms and privacy policy"
                />
              </Field>
            </FieldGroup>
            <div className="mt-6">
              <Button variant="primary" className="w-full justify-center">
                Request access
              </Button>
            </div>
          </Fieldset>
        </Card>
      </div>
    );
  },
};

// ── Checkboxes group ──────────────────────────────────────

export const CheckboxGroup: Story = {
  name: 'Checkbox group',
  render: () => {
    const [perms, setPerms] = useState({ read: true, write: false, delete: false });
    return (
      <div className="max-w-sm">
        <Fieldset>
          <Legend>Permissions</Legend>
          <Description className="mt-1 text-xs text-ink-500 dark:text-ink-300 font-body">
            Choose what this API key is allowed to do.
          </Description>
          <FieldGroup gap="sm" className="mt-4">
            <Field>
              <Checkbox
                checked={perms.read}
                onChange={v => setPerms(p => ({ ...p, read: v }))}
                label="Read"
                description="View resources"
              />
            </Field>
            <Field>
              <Checkbox
                checked={perms.write}
                onChange={v => setPerms(p => ({ ...p, write: v }))}
                label="Write"
                description="Create and update resources"
              />
            </Field>
            <Field>
              <Checkbox
                checked={perms.delete}
                onChange={v => setPerms(p => ({ ...p, delete: v }))}
                label="Delete"
                description="Permanently remove resources"
              />
            </Field>
          </FieldGroup>
        </Fieldset>
      </div>
    );
  },
};
