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
  nocType: z.enum(["PROVISIONAL", "AMENDMENT", "FINAL", "TEMPORARY"]),
  applicantName: z.string().min(2, "Applicant name required"),
  applicantEmail: z.string().email("Valid email required"),
  applicantPhone: z.string().min(10, "Valid phone number required"),
  projectName: z.string().min(2, "Project name required"),
  buildingAddress: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  ward: z.string().min(1, "Ward required"),
  squareMeterage: z
    .string()
    .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: "Must be a positive number" }),
});

type FormData = z.infer<typeof schema>;

export default function NOCApplicationForm() {
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
        title="New NOC Application"
        subtitle="Submit a new No Objection Certificate application"
        breadcrumbs={[
          { label: "NOC Management", href: "/noc" },
          { label: "Applications", href: "/noc/applications" },
          { label: "New Application" },
        ]}
      />

      {submitted && (
        <InlineNotification
          kind="success"
          title="Application Submitted"
          subtitle="Your NOC application has been submitted successfully."
          style={{ marginBottom: "1.5rem" }}
          lowContrast
        />
      )}

      <Tile style={{ padding: "2rem" }}>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Grid fullWidth>
            <Column lg={16} md={8} sm={4}>
              <Heading style={{ fontSize: "1rem", marginBottom: "1.5rem", color: "var(--cds-text-secondary)" }}>
                Application Details
              </Heading>
            </Column>

            <Column lg={8} md={4} sm={4}>
              <Stack gap={5}>
                <Select
                  id="nocType"
                  labelText="NOC Type *"
                  invalid={!!errors.nocType}
                  invalidText={errors.nocType?.message}
                  {...register("nocType")}
                >
                  <SelectItem value="" text="Select NOC Type" />
                  <SelectItem value="PROVISIONAL" text="Provisional NOC" />
                  <SelectItem value="AMENDMENT" text="Amendment NOC" />
                  <SelectItem value="FINAL" text="Final NOC" />
                  <SelectItem value="TEMPORARY" text="Temporary NOC" />
                </Select>

                <TextInput
                  id="applicantName"
                  labelText="Applicant Name *"
                  placeholder="Enter applicant / company name"
                  invalid={!!errors.applicantName}
                  invalidText={errors.applicantName?.message}
                  {...register("applicantName")}
                />

                <TextInput
                  id="applicantEmail"
                  labelText="Applicant Email *"
                  type="email"
                  placeholder="applicant@example.com"
                  invalid={!!errors.applicantEmail}
                  invalidText={errors.applicantEmail?.message}
                  {...register("applicantEmail")}
                />

                <TextInput
                  id="applicantPhone"
                  labelText="Applicant Phone *"
                  placeholder="9876543210"
                  invalid={!!errors.applicantPhone}
                  invalidText={errors.applicantPhone?.message}
                  {...register("applicantPhone")}
                />
              </Stack>
            </Column>

            <Column lg={8} md={4} sm={4}>
              <Stack gap={5}>
                <TextInput
                  id="projectName"
                  labelText="Project Name *"
                  placeholder="Enter project / building name"
                  invalid={!!errors.projectName}
                  invalidText={errors.projectName?.message}
                  {...register("projectName")}
                />

                <TextInput
                  id="buildingAddress"
                  labelText="Building Address *"
                  placeholder="Full address of the building"
                  invalid={!!errors.buildingAddress}
                  invalidText={errors.buildingAddress?.message}
                  {...register("buildingAddress")}
                />

                <TextInput
                  id="city"
                  labelText="City *"
                  placeholder="e.g. Navi Mumbai"
                  invalid={!!errors.city}
                  invalidText={errors.city?.message}
                  {...register("city")}
                />

                <TextInput
                  id="ward"
                  labelText="Ward *"
                  placeholder="e.g. Ward No. 5"
                  invalid={!!errors.ward}
                  invalidText={errors.ward?.message}
                  {...register("ward")}
                />

                <TextInput
                  id="squareMeterage"
                  labelText="Area (sq. m.) *"
                  type="number"
                  placeholder="e.g. 1500"
                  invalid={!!errors.squareMeterage}
                  invalidText={errors.squareMeterage?.message}
                  {...register("squareMeterage")}
                />
              </Stack>
            </Column>

            <Column lg={16} md={8} sm={4}>
              <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                <Button type="submit" renderIcon={Save} disabled={loading}>
                  {loading ? "Submitting…" : "Submit Application"}
                </Button>
                <Button kind="secondary" href="/noc/applications">
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
