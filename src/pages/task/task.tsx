import { ChangeEvent, useState } from 'react'; // Import ChangeEvent type
import { useForm } from '@mantine/form';
import { FaCircle } from 'react-icons/fa';
import {
  SimpleGrid,
  Grid,
  Flex,
  Button,
  TextInput,
  Select,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { TextEditor } from '../../concave.agri/components/richtext';

interface ChecklistItem {
  text: string;
  dropdownValue: string;
  checked: boolean;
}
export function Demo() {
  const form = useForm({
    initialValues: {
      title: '',
      status: 'inProgress',
      description: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: null,
      repeat: 'daily',
      hoursSpent: '',
      latitude: '',
      longitude: '',
      attachment: null,
      checklist: [] as ChecklistItem[],
    },
  });

  const handleAddLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude.toString(); // Convert to string
        const longitude = position.coords.longitude.toString(); // Convert to string
        form.setFieldValue('latitude', latitude);
        form.setFieldValue('longitude', longitude);
        // Open Google Maps with latitude and longitude
        window.open(
          `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
        );
      },
      error => {
        console.error('Error getting location:', error);
      }
    );
  };
  const handleAttachmentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null; // Ensure file is of type File | null
    // form.setFieldValue('attachment', file);
  };

  const handleAddAttachmentClick = () => {
    // Trigger click event on hidden file input
    const fileInput = document.getElementById('attachment-input');
    fileInput?.click();
  };

  // const [checklistItem, setChecklistItem] = useState<ChecklistItem>({
  //   text: '',
  //   dropdownValue: '',
  // });

  const handleAddChecklistItem = () => {
    const newChecklistItem: ChecklistItem = {
      text: '',
      dropdownValue: '',
      checked: false,
    };
    form.setFieldValue('checklist', [
      ...form.values.checklist,
      newChecklistItem,
    ]);
  };

  const handleChecklistTextChange = (index: number, value: string) => {
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist[index].text = value;
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleChecklistDropdownChange = (
    index: number,
    value: string | null
  ) => {
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist[index].dropdownValue = value || '';
    form.setFieldValue('checklist', updatedChecklist);
  };
  const handleRemoveChecklistItem = (index: number) => {
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist.splice(index, 1);
    form.setFieldValue('checklist', updatedChecklist);
  };
  const handleChecklistCheckboxChange = (index: number, checked: boolean) => {
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist[index].checked = checked;
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleDeleteChecklistItem = (index: number) => {
    // Remove checklist item from form state
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist.splice(index, 1);
    form.setFieldValue('checklist', updatedChecklist);
  };

  return (
    <div>
      {/* Add Task Container */}
      <Grid>
        {/* Add Task Container 70% */}
        <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
          <Grid.Col>
            <label>Title *</label>
            <TextInput
              placeholder="Enter title"
              withAsterisk
              {...form.getInputProps('title')}
            />
          </Grid.Col>
          <Grid.Col>
            <label>Description</label>
            <TextEditor />
          </Grid.Col>
          <Grid.Col>
            <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={handleAddChecklistItem}
                >
                  Add Checklist
                </Button>
                {form.values.checklist.map(
                  (item: ChecklistItem, index: number) => (
                    <div key={index} className="flex items-center mt-4">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={e =>
                          handleChecklistCheckboxChange(index, e.target.checked)
                        }
                      />
                      <div className="flex-grow flex">
                        <TextInput
                          placeholder="Enter text"
                          value={item.text}
                          onChange={e =>
                            handleChecklistTextChange(index, e.target.value)
                          }
                          className="flex-grow ml-2"
                        />
                        <Select
                          placeholder="Select value"
                          value={item.dropdownValue}
                          onChange={value =>
                            handleChecklistDropdownChange(index, value)
                          }
                          data={['Option 1', 'Option 2', 'Option 3'].map(
                            option => ({
                              value: option,
                              label: option,
                            })
                          )}
                          className="ml-2"
                        />
                      </div>
                      <Button
                        onClick={() => handleRemoveChecklistItem(index)}
                        className="ml-2"
                      >
                        Remove
                      </Button>
                    </div>
                  )
                )}
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={handleAddLocation}
                >
                  Add Location
                </Button>
              </Grid.Col>
              <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                <Button
                  type="button"
                  className="mt-4"
                  onClick={handleAddAttachmentClick}
                >
                  Add Attachment
                </Button>
              </Grid.Col>
            </Grid>
          </Grid.Col>
          <Grid.Col>
            <label>Associated To</label>
            <TextInput placeholder="Enter value" radius="xl" mt="md" />
          </Grid.Col>
          <Grid.Col>
            <h2 className="mb-2">Task Color</h2>
            <SimpleGrid cols={{ base: 6, md: 6, lg: 14 }} spacing="xs">
              <div>
                <a style={{ color: '#bdbdbd' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#ef5350' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#ec407a' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#7e57c2' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#5c6bc0' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#42a5f5' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#29b6f6' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#26c6da' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#26a69a' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#66bb6a' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#9ccc65' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#d4e157' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#ffee58' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#ffca28' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#ffa726' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#ff7043' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#8d6e63' }}>
                  <FaCircle size={25} />
                </a>
              </div>
              <div>
                <a style={{ color: '#78909c' }}>
                  <FaCircle size={25} />
                </a>
              </div>
            </SimpleGrid>
          </Grid.Col>
        </Grid.Col>
        {/* End of Add Task Container 70% */}
        {/* Add Task Container 30% */}
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <Grid.Col>
            <label>Status</label>
            <Select
              placeholder="Select status"
              withAsterisk
              {...form.getInputProps('status')}
              data={['inProgress', 'done', 'toDo'].map(status => ({
                value: status,
                label: status,
              }))}
            />
          </Grid.Col>
          <Grid.Col>
            <label>Assigned to</label>
            <Select
              placeholder="Select person"
              withAsterisk
              {...form.getInputProps('assignedTo')}
              data={['Person A', 'Person B', 'Person C'].map(person => ({
                value: person,
                label: person,
              }))}
            />
          </Grid.Col>
          <Grid.Col>
            <label>Priority</label>
            <Select
              placeholder="Select priority"
              withAsterisk
              {...form.getInputProps('priority')}
              data={['high', 'medium', 'low'].map(priority => ({
                value: priority,
                label: priority,
              }))}
            />
          </Grid.Col>
          <Grid.Col>
            <label>Due Date and Time</label>
            <DateTimePicker
              placeholder="Select due date and time"
              withAsterisk
              {...form.getInputProps('dueDate')}
            />
          </Grid.Col>
          <Grid.Col>
            <label>Repeat</label>
            <Select
              placeholder="Select repeat option"
              withAsterisk
              {...form.getInputProps('repeat')}
              data={['daily', 'weekly', 'monthly', 'yearly'].map(option => ({
                value: option,
                label: option,
              }))}
            />
          </Grid.Col>
          <Grid.Col>
            <label>Hours Spent</label>
            <TextInput
              placeholder="Enter hours spent"
              withAsterisk
              type="number"
              {...form.getInputProps('hoursSpent')}
            />
          </Grid.Col>
        </Grid.Col>
        {/* End of Add Task Container 30% */}
      </Grid>
      <Flex
        mih={50}
        gap="xs"
        justify="flex-end"
        align="flex-start"
        direction="row"
        wrap="wrap"
      >
        <Button type="submit">Close</Button>
        <Button type="submit">Create</Button>
      </Flex>
      <input
        id="attachment-input"
        type="file"
        accept="image/*, .pdf, .doc, .docx"
        style={{ display: 'none' }}
        onChange={handleAttachmentChange}
      />

      {form.values.checklist.map((item: any, index: number) => (
        <div key={index} className="flex items-center mt-4"></div>
      ))}
    </div>
  );
}
