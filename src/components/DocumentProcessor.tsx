import { useState } from 'react';
import { Paper, Title, Text, Group, Alert, Card, Grid, TextInput, Textarea, MultiSelect, Stack, Button, Progress, Container, Badge, Center, RingProgress } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconX, IconWand, IconBrain, IconRobot, IconFileAnalytics, IconCircleCheck } from '@tabler/icons-react';
import { DocumentOutput, DocumentInput } from '../types/document';
import { processDocument, uploadFile } from '../services/api';

export function DocumentProcessor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DocumentOutput | null>(null);
  const [progress, setProgress] = useState(0);
  const [processingStep, setProcessingStep] = useState('');

  const simulateAIProgress = () => {
    setProgress(0);
    setProcessingStep('Initializing AI analysis...');
    
    const steps = [
      { progress: 20, message: 'Reading document content...' },
      { progress: 40, message: 'Analyzing document structure...' },
      { progress: 60, message: 'Extracting key information...' },
      { progress: 80, message: 'Processing metadata...' },
      { progress: 95, message: 'Finalizing results...' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setProcessingStep(steps[currentStep].message);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 800);

    return () => clearInterval(interval);
  };

  const handleDrop = async (files: File[]) => {
    if (files.length === 0) return;

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const cleanupProgress = simulateAIProgress();
      const uploadResponse = await uploadFile(files[0], 'User');
      
      const input: DocumentInput = {
        inputs: {
          document: {
            type: "document",
            transfer_method: "local_file",
            upload_file_id: uploadResponse.id
          },
        },
        workflow_id: "cd887ec2-135d-4820-afb5-807dc9c4a02b",
        user: "User"
      };

      const response = await processDocument(input);
      setResult(response.data.outputs.output);
      cleanupProgress();
      setProgress(100);
      setProcessingStep('Analysis complete!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    return (
      <Stack gap="md">
        <Paper shadow="sm" p="lg" radius="lg">
          {result && (
            <Badge 
              color="blue" 
              variant="light" 
              size="lg" 
              radius="md"
              leftSection={<IconCircleCheck size={16} />}
              mb="md"
            >
              AI Analysis Complete
            </Badge>
          )}
          <Grid gutter="lg">
            <Grid.Col span={12}>
              <TextInput
                label="Document Title"
                placeholder="AI will detect title"
                value={result?.document_title || ''}
                readOnly
                leftSection={<IconFileAnalytics size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />}
                styles={{ input: { backgroundColor: 'white' } }}
              />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Description"
                placeholder="AI will extract description"
                value={result?.document_description || ''}
                readOnly
                minRows={3}
                styles={{ input: { backgroundColor: 'white' } }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Project"
                placeholder="AI will detect project"
                value={result?.project || ''}
                readOnly
                leftSection={<IconFileAnalytics size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />}
                styles={{ input: { backgroundColor: 'white' } }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Document Type"
                placeholder="AI will detect document type"
                value={result?.document_type || ''}
                readOnly
                leftSection={<IconFileAnalytics size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />}
                styles={{ input: { backgroundColor: 'white' } }}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        <Grid>
          <Grid.Col span={6}>
            <Paper shadow="sm" p="lg" radius="lg">
              {result && (
                <Badge 
                  color="blue" 
                  variant="light" 
                  size="sm" 
                  radius="md"
                  leftSection={<IconCircleCheck size={14} />}
                  mb="md"
                >
                  Theme Analysis Complete
                </Badge>
              )}
              <Stack gap="md">
                <TextInput
                  label="Theme"
                  placeholder="AI will detect theme"
                  value={result?.theme || ''}
                  readOnly
                  leftSection={<IconWand size={16} style={{ color: 'var(--mantine-color-blue-6)' }} />}
                  styles={{ input: { backgroundColor: 'white' } }}
                />
                <MultiSelect
                  label="Sub Themes"
                  placeholder="AI will detect sub themes"
                  value={result?.sub_themes || []}
                  data={result?.sub_themes || []}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper shadow="sm" p="lg" radius="lg">
              {result && (
                <Badge 
                  color="blue" 
                  variant="light" 
                  size="sm" 
                  radius="md"
                  leftSection={<IconCircleCheck size={14} />}
                  mb="md"
                >
                  Category Analysis Complete
                </Badge>
              )}
              <Stack gap="md">
                <TextInput
                  label="Category"
                  placeholder="AI will detect category"
                  value={result?.category || ''}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
                <TextInput
                  label="Sub Category"
                  placeholder="AI will detect sub category"
                  value={result?.sub_category || ''}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={6}>
            <Paper shadow="sm" p="lg" radius="lg">
              {result && (
                <Badge 
                  color="blue" 
                  variant="light" 
                  size="sm" 
                  radius="md"
                  leftSection={<IconCircleCheck size={14} />}
                  mb="md"
                >
                  Location Analysis Complete
                </Badge>
              )}
              <Stack gap="md">
                <TextInput
                  label="State"
                  placeholder="AI will detect state"
                  value={result?.state || ''}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
                <MultiSelect
                  label="Districts"
                  placeholder="AI will detect districts"
                  value={result?.districts || []}
                  data={result?.districts || []}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={6}>
            <Paper shadow="sm" p="lg" radius="lg">
              {result && (
                <Badge 
                  color="blue" 
                  variant="light" 
                  size="sm" 
                  radius="md"
                  leftSection={<IconCircleCheck size={14} />}
                  mb="md"
                >
                  Organization Analysis Complete
                </Badge>
              )}
              <Stack gap="md">
                <TextInput
                  label="Implementation Partner"
                  placeholder="AI will detect partner"
                  value={result?.implementation_partner || ''}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
                <TextInput
                  label="Funding Agency"
                  placeholder="AI will detect agency"
                  value={result?.funding_agency || ''}
                  readOnly
                  styles={{ input: { backgroundColor: 'white' } }}
                />
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        <Paper shadow="sm" p="lg" radius="lg">
          {result && (
            <Badge 
              color="blue" 
              variant="light" 
              size="sm" 
              radius="md"
              leftSection={<IconCircleCheck size={14} />}
              mb="md"
            >
              Additional Details Complete
            </Badge>
          )}
          <Grid>
            <Grid.Col span={6}>
              <MultiSelect
                label="Languages"
                placeholder="AI will detect languages"
                value={result?.languages || []}
                data={result?.languages || []}
                readOnly
                styles={{ input: { backgroundColor: 'white' } }}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <MultiSelect
                label="Tags"
                placeholder="AI will detect tags"
                value={result?.tags || []}
                data={result?.tags || []}
                readOnly
                styles={{ input: { backgroundColor: 'white' } }}
              />
            </Grid.Col>
          </Grid>
        </Paper>

        <Group justify="center" mt="xl">
          <Button 
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
            size="lg"
            leftSection={<IconWand size={20} />}
            disabled={!result}
            radius="xl"
          >
            Save Auto-Filled Form
          </Button>
        </Group>
      </Stack>
    );
  };

  return (
    <Container size="xl" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Grid gutter={40}>
          <Grid.Col span={5}>
            <Stack gap="lg">
              <Group>
                <IconBrain size={40} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Title order={2} style={{ color: 'var(--mantine-color-blue-9)' }}>
                  AI Document Analyzer
                </Title>
              </Group>
              
              <Paper shadow="sm" radius="lg" withBorder>
                <Dropzone
                  onDrop={handleDrop}
                  maxSize={10 * 1024 ** 2}
                  loading={loading}
                  style={{ border: 'none', background: 'transparent' }}
                  p="xl"
                >
                  <Center style={{ minHeight: 200, flexDirection: 'column', gap: '1rem' }}>
                    <Dropzone.Accept>
                      <IconUpload size={50} stroke={1.5} style={{ color: 'var(--mantine-color-blue-6)' }} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                      <IconX size={50} stroke={1.5} style={{ color: 'var(--mantine-color-red-6)' }} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                      <IconRobot size={50} stroke={1.5} style={{ color: 'var(--mantine-color-blue-6)' }} />
                    </Dropzone.Idle>

                    <Stack gap="xs" align="center">
                      <Text size="xl" fw={600} style={{ color: 'var(--mantine-color-blue-9)' }}>
                        Upload Document for AI Analysis
                      </Text>
                      <Text size="sm" c="dimmed" ta="center">
                        Drag & drop your document here or click to browse
                      </Text>
                      <Text size="xs" c="dimmed">
                        Max file size: 10MB
                      </Text>
                    </Stack>
                  </Center>
                </Dropzone>
              </Paper>

              {loading && (
                <Card shadow="sm" p="lg" radius="lg">
                  <Stack align="center" gap="md">
                    <RingProgress
                      size={120}
                      thickness={12}
                      sections={[{ value: progress, color: 'blue' }]}
                      label={
                        <Center>
                          <IconBrain size={30} style={{ color: 'var(--mantine-color-blue-6)' }} />
                        </Center>
                      }
                    />
                    <Text fw={500} size="lg" style={{ color: 'var(--mantine-color-blue-9)' }}>
                      {processingStep}
                    </Text>
                    <Progress 
                      value={progress} 
                      size="sm" 
                      radius="xl" 
                      color="blue" 
                      striped 
                      animated
                      w="100%"
                    />
                  </Stack>
                </Card>
              )}

              {error && (
                <Alert color="red" title="Error" variant="filled" radius="lg">
                  {error}
                </Alert>
              )}

              {result && (
                <Alert 
                  color="blue" 
                  title="AI Analysis Complete" 
                  variant="filled"
                  radius="lg"
                  icon={<IconWand size={18} />}
                >
                  Document analyzed successfully! All form fields have been auto-filled using AI.
                </Alert>
              )}
            </Stack>
          </Grid.Col>

          <Grid.Col span={7}>
            <Stack gap="lg">
              <Group>
                <IconFileAnalytics size={40} style={{ color: 'var(--mantine-color-blue-6)' }} />
                <Title order={2} style={{ color: 'var(--mantine-color-blue-9)' }}>
                  AI-Powered Form
                </Title>
              </Group>
              {renderForm()}
            </Stack>
          </Grid.Col>
        </Grid>
      </Paper>
    </Container>
  );
} 