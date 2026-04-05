import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  Stack,
  TextInput,
  Select,
  SelectItem,
  TextArea,
  Button,
  InlineNotification,
  Grid,
  Column,
  Tile,
  Heading,
} from "@carbon/react";
import { Save } from "@carbon/icons-react";
import { PageHeader } from "@/components/shared/PageHeader";

const schema = z.object({
  title: z.string().min(3, "Title required"),
  typeId: z.string().min(1, "Incident type required"),
  address: z.string().min(5, "Address required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  severity: z.string().min(1, "Severity required"),
  description: z.string().min(10, "Description required (min 10 chars)"),
  reportedBy: z.string().min(2, "Reporter name required"),
});

type FormData = z.infer<typeof schema>;

export default function IncidentForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        title="Report Incident"
        subtitle="Submit a new fire, rescue or hazmat incident report"
        breadcrumbs={[
          { label: "Incident Management", href: "/incident" },
          { label: "All Incidents", href: "/incident/list" },
          { label: "Report Incident" },
        ]}
      />

      {submitted && (
        <InlineNotification
          kind="success"
          title="Incident Reported"
          subtitle="The incident has been reported and response team notified."
          style={{ marginBottom: "1.5rem" }}
          lowContrast
        />
      )}

      <Tile style={{ padding: "2rem" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid fullWidth>
            <Column lg={16} md={8} sm={4}>
              <Heading style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "var(--cds-text-secondary)" }}>
                Incident Details
              </Heading>
            </Column>

            <Column lg={8} md={4} sm={4}>
              <Stack gap={5}>
                <TextInput
                  id="title"
                  labelText="Incident Title *"
                  placeholder="Brief description of the incident"
                  invalid={!!errors.title}
                  invalidText={errors.title?.message}
                  {...register("title")}
                />

                <Select
                  id="typeId"
                  labelText="Incident Type *"
                  invalid={!!errors.typeId}
                  invalidText={errors.typeId?.message}
                  {...register("typeId")}
                >
                  <SelectItem value="" text="Select Incident Type" />
                  <SelectItem value="FIRE" text="Fire" />
                  <SelectItem value="RESCUE" text="Rescue" />
                  <SelectItem value="HAZMAT" text="Hazmat / Chemical" />
                  <SelectItem value="FLOOD" text="Flood / Natural Disaster" />
                  <SelectItem value="MEDICAL" text="Medical Emergency" />
                  <SelectItem value="OTHER" text="Other" />
                </Select>

                <Select
                  id="priority"
                  labelText="Priority *"
                  invalid={!!errors.priority}
                  invalidText={errors.priority?.message}
                  {...register("priority")}
                >
                  <SelectItem value="" text="Select Priority" />
                  <SelectItem value="LOW" text="Low" />
                  <SelectItem value="MEDIUM" text="Medium" />
                  <SelectItem value="HIGH" text="High" />
                  <SelectItem value="CRITICAL" text="Critical" />
                </Select>

                <Select
                  id="severity"
                  labelText="Severity *"
                  invalid={!!errors.severity}
                  invalidText={errors.severity?.message}
                  {...register("severity")}
                >
                  <SelectItem value="" text="Select Severity" />
                  <SelectItem value="S1" text="S1 - Minor" />
                  <SelectItem value="S2" text="S2 - Moderate" />
                  <SelectItem value="S3" text="S3 - Major" />
                  <SelectItem value="S4" text="S4 - Catastrophic" />
                </Select>
              </Stack>
            </Column>

            <Column lg={8} md={4} sm={4}>
              <Stack gap={5}>
                <TextInput
                  id="address"
                  labelText="Incident Address *"
                  placeholder="Full address of the incident location"
                  invalid={!!errors.address}
                  invalidText={errors.address?.message}
                  {...register("address")}
                />

                <TextInput
                  id="reportedBy"
                  labelText="Reported By *"
                  placeholder="Name of the person reporting"
                  invalid={!!errors.reportedBy}
                  invalidText={errors.reportedBy?.message}
                  {...register("reportedBy")}
                />

                <TextArea
                  id="description"
                  labelText="Description *"
                  placeholder="Detailed description of the incident..."
                  rows={5}
                  invalid={!!errors.description}
                  invalidText={errors.description?.message}
                  {...register("description")}
                />
              </Stack>
            </Column>

            <Column lg={16} md={8} sm={4}>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <Button type="submit" renderIcon={Save} disabled={loading}>
                  {loading ? "Submitting…" : "Report Incident"}
                </Button>
                <Button kind="secondary" href="/incident/list">
                  Cancel
                </Button>
              </div>
            </Column>
          </Grid>
        </Form>
      </Tile>
    </>
  );
}
