import React, { ChangeEvent, useState } from 'react'; // Import ChangeEvent type
import { useForm, isNotEmpty, hasLength } from '@mantine/form';
import { FaCircle } from "react-icons/fa";
import {
  Container,
  SimpleGrid,
  Grid,
  Flex,
  Button,
  Group,
  TextInput,
  Box,
  Select,
  Textarea,
  Input,
  Text,
  GridCol,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { RichTextEditor } from '@mantine/tiptap';
import { TextEditor } from '../../concave.agri/components/richtext';

interface ChecklistItem {
  text: string;
  dropdownValue: string;
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

  const [checklistItem, setChecklistItem] = useState<ChecklistItem>({
    text: '',
    dropdownValue: '',
  });

  const handleAddChecklistItem = () => {
    // Add new checklist item to form state
    form.setFieldValue('checklist', [...form.values.checklist, checklistItem]);
    // Reset checklist item fields
    setChecklistItem({ text: '', dropdownValue: '' });
  };

  const handleDeleteChecklistItem = (index: number) => {
    // Remove checklist item from form state
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist.splice(index, 1);
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleChecklistTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    setChecklistItem({ ...checklistItem, text: e.target.value });
  };

  const handleChecklistDropdownChange = (value: string | null) => {
    // Provide a default value if value is null
    const dropdownValue = value || '';
    setChecklistItem({ ...checklistItem, dropdownValue });
  };

  return (
    <Box
      component="form"
      mx="auto"
      onSubmit={form.onSubmit(() => {})}
      className="p-8 rounded-lg border border-gray-200 shadow-md TST"
    >
      {/* Add Task Container */}
      <Grid>
        {/* Add Task Container 70% */}
           <Grid.Col span={{ base: 12 , md: 6, lg: 8 }}>
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
            <Grid.Col span={4}>
              <Button
                type="button"
                onClick={handleAddChecklistItem}
                variant="outline"
                className="mt-4"
              >
                Add Checklist
              </Button>
                 </Grid.Col>
            <Grid.Col span={4}>
              <Button type="button" className="mt-4" onClick={handleAddLocation}>
                Add Location
              </Button>
              </Grid.Col>
            <Grid.Col span={4}>
              <Button type="button" className="mt-4" onClick={handleAddAttachmentClick}>
                Add Attachment
              </Button>
              </Grid.Col>
        </Grid>
        </Grid.Col>
              <Grid.Col>
                <label>Associated To</label>
                      <TextInput
                        placeholder="Enter value"
                        radius="xl"
                        mt="md"
                      />
                   </Grid.Col>
<Grid.Col>
  <h2 className='mb-2'>Task Color</h2>
    <SimpleGrid cols={16}>
      <div><a style={{color:'#bdbdbd'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#ef5350'}}><FaCircle size={25} /></a></div>
      <div><a style={{color:'#ec407a'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#7e57c2'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#5c6bc0'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#42a5f5'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#29b6f6'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#26c6da'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#26a69a'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#66bb6a'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#9ccc65'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#d4e157'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#ffee58'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#ffca28'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#ffa726'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#ff7043'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#8d6e63'}}><FaCircle size={25}/></a></div>
      <div><a style={{color:'#78909c'}}><FaCircle size={25}/></a></div>
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
        }))}/>
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
{/* End of Add Task Container */}



      {/* <Grid>
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
        <TextInput
        label="Title"
        placeholder="Enter title"
        withAsterisk
        mt="md"
        {...form.getInputProps('title')}
      />
      </Grid.Col>
      
      <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
      <Select
        label="Status"
        placeholder="Select status"
        withAsterisk
        mt="md"
        {...form.getInputProps('status')}
        data={['inProgress', 'done', 'toDo'].map(status => ({
          value: status,
          label: status,
        }))}
      /></Grid.Col>
      </Grid> */}

      {/* <Select
        label="Assigned to"
        placeholder="Select person"
        withAsterisk
        mt="md"
        {...form.getInputProps('assignedTo')}
        data={['Person A', 'Person B', 'Person C'].map(person => ({
          value: person,
          label: person,
        }))}
      />

      <Select
        label="Priority"
        placeholder="Select priority"
        withAsterisk
        mt="md"
        {...form.getInputProps('priority')}
        data={['high', 'medium', 'low'].map(priority => ({
          value: priority,
          label: priority,
        }))}
      />

      <DateTimePicker
        label="Due Date and Time"
        placeholder="Select due date and time"
        withAsterisk
        mt="md"
        {...form.getInputProps('dueDate')}
      />

      <Select
        label="Repeat"
        placeholder="Select repeat option"
        withAsterisk
        mt="md"
        {...form.getInputProps('repeat')}
        data={['daily', 'weekly', 'monthly', 'yearly'].map(option => ({
          value: option,
          label: option,
        }))}
      />

      <TextInput
        label="Hours Spent"
        placeholder="Enter hours spent"
        withAsterisk
        mt="md"
        type="number"
        {...form.getInputProps('hoursSpent')}
      />
      <TextInput
        label="Associated To"
        placeholder="Enter value"
        radius="xl"
        mt="md"
      />
      <input
        id="attachment-input"
        type="file"
        name="attachment"
        style={{ display: 'none' }}
        onChange={handleAttachmentChange}
      /> */}

      {form.values.checklist.map((item: any, index: number) => (
        <div key={index} className="flex items-center mt-4">
          {/* Checkbox */}
          
          {/* Text field */}
          {/* <TextInput
            value={item.text}
            onChange={e => handleChecklistTextChange(e)}
            placeholder="Checklist item"
            className="mr-2"
          /> */}
          {/* Dropdown */}
          {/* <Select
            value={item.dropdownValue}
            onChange={value => handleChecklistDropdownChange(value)}
            placeholder="Select option"
            className="mr-2"
            data={['Option 1', 'Option 2', 'Option 3'].map(option => ({
              value: option,
              label: option,
            }))}
          /> */}
          {/* Delete button */}
          {/* <Button
            onClick={() => handleDeleteChecklistItem(index)}
            variant="outline"
            color="red"
          >
            Delete
          </Button> */}
        </div>
      ))}

      {/* <Text>Description</Text>
      <TextEditor /> */}

      {/* <Group justify="space-between" mt="md">
        <Button
          type="button"
          onClick={handleAddChecklistItem}
          variant="outline"
          className="mt-4"
        >
          Add Checklist
        </Button>
        
        <Button type="button" onClick={handleAddAttachmentClick}>
          Add Attachment
        </Button>
        <Button type="button" onClick={handleAddLocation}>
          Add Location
        </Button>
        <Button type="submit">Close</Button>
        <Button type="submit">Create</Button>
      </Group> */}
    </Box>
   
  );
}
