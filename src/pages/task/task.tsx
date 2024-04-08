import React, { ChangeEvent, useState } from 'react'; // Import ChangeEvent type
import { useForm, isNotEmpty, hasLength } from '@mantine/form';
import {
  Button,
  Group,
  TextInput,
  Box,
  Select,
  Textarea,
  Input,
  Text,
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
      className="p-8 rounded-lg border border-gray-200 shadow-md"
    >
      <TextInput
        label="Title"
        placeholder="Enter title"
        withAsterisk
        mt="md"
        {...form.getInputProps('title')}
      />

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
      />

      <Select
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
      />

      {form.values.checklist.map((item: any, index: number) => (
        <div key={index} className="flex items-center mt-4">
          {/* Checkbox */}
          <input type="checkbox" className="mr-2" />
          {/* Text field */}
          <TextInput
            value={item.text}
            onChange={e => handleChecklistTextChange(e)}
            placeholder="Checklist item"
            className="mr-2"
          />
          {/* Dropdown */}
          <Select
            value={item.dropdownValue}
            onChange={value => handleChecklistDropdownChange(value)}
            placeholder="Select option"
            className="mr-2"
            data={['Option 1', 'Option 2', 'Option 3'].map(option => ({
              value: option,
              label: option,
            }))}
          />
          {/* Delete button */}
          <Button
            onClick={() => handleDeleteChecklistItem(index)}
            variant="outline"
            color="red"
          >
            Delete
          </Button>
        </div>
      ))}

      <Text>Description</Text>
      <TextEditor />

      <Group justify="space-between" mt="md">
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
      </Group>
    </Box>
  );
}
