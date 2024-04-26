import {
  Flex,
  Grid,
  SimpleGrid,
  Textarea,
  useMantineTheme,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useFormik } from 'formik';
import { ChangeEvent, useEffect, useState } from 'react'; // Import ChangeEvent type
import { FaCircle } from 'react-icons/fa';
import {
  Button,
  Checkbox,
  Select,
  TextInput,
} from '../../concave.agri/components';
import { colorArray } from '../../utils/common/constant.objects';
import { Text } from '@mantine/core';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { MdAttachFile } from 'react-icons/md';
import { MdChecklistRtl } from 'react-icons/md';
import { AiOutlineDelete } from 'react-icons/ai';
import { fetchData, postData, putData } from '../../api/api';
import { useSelector } from 'react-redux';
interface ChecklistItem {
  text: string;
  dropdownValue: string;
  checked: boolean;
}

export function TaskForm({
  onCloseButton, // Function to handle close button click
  mode = 'Add', // Form mode: 'Add' or 'Update'
  handleNotification, // Function to handle notifications
  viewOrUpdate,
}: {
  onCloseButton: () => void;
  mode?: string;
  handleNotification: any;
  viewOrUpdate: any;
}) {
  // Initialize the useMantineTheme hook for accessing theme variables

  const userInfo = useSelector((state: any) => state?.userInfo?.userInfo);

  const [userList, setUserList] = useState([]);

  useEffect(() => {
    fetchData(
      `users?rpp=10&page=1&filter={"filter":[{"field":"farmId","operator":"eq","value":${userInfo.farmId}}]}`
    )
      .then((response: any) => {
        setUserList(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const theme = useMantineTheme();
  const form = useFormik({
    enableReinitialize: true,
    initialValues:
      viewOrUpdate?.type === 'Add'
        ? {
            taskTitle: '',
            taskStatus: '',
            taskDescription: '',
            assigned: '',
            priority: '',
            endDateTime: null,
            startDateTime: null,
            associatedTo: '',
            repeatedTask: '',
            hoursSpent: '',
            latitude: '',
            longitude: '',
            attachments: [],
            checklist: [],
          }
        : viewOrUpdate.objectData,
    onSubmit: values => {
      viewOrUpdate?.type === 'Edit'
        ? putData(`/task/${viewOrUpdate.objectData.userId}`, values)
            .then(() => {
              // Handle successful form submission
              handleNotification({
                isSuccess: true,
                message: 'Task updated successfully',
                title: 'Successfully',
                isEnable: true,
              });
            })
            .catch(error => {
              // Handle form submission error
              handleNotification({
                isSuccess: false,
                message: error?.response?.data?.message ?? error?.message,
                title: 'Something went wrong',
                isEnable: true,
              });
            })
        : postData('/task', {
            ...values,
            assignedTo: values.assigned,
            assigned: Number(values.assigned),
          }) // Send form data to the server
            .then(() => {
              // Handle successful form submission
              handleNotification({
                isSuccess: true,
                message: 'Task created successfully',
                title: 'Successfully',
                isEnable: true,
              });
            })
            .catch(error => {
              // Handle form submission error
              handleNotification({
                isSuccess: false,
                message: error?.response?.data?.message ?? error?.message,
                title: 'Something went wrong',
                isEnable: true,
              });
            });
    },
  });

  const handleAddLocation = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const latitude = position.coords.latitude?.toString(); // Convert to string
        const longitude = position.coords.longitude?.toString(); // Convert to string
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
    if (file) {
      const newAttachment = {
        name: file.name,
        isDeleted: false,
        extension: file.name.split('.').pop(), // Extract extension from file name
        url: URL.createObjectURL(file), // Generate URL for local preview
      };
      form.setFieldValue('attachments', [
        ...form.values.attachments,
        newAttachment,
      ]);
    }
  };

  const handleAddAttachmentClick = () => {
    // Trigger click event on hidden file input
    const fileInput = document.getElementById('attachment-input');
    fileInput?.click();
  };

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
    const updatedChecklist: ChecklistItem[] = [...form.values.checklist];
    updatedChecklist[index].text = value;
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleChecklistDropdownChange = (
    index: number,
    value: string | null
  ) => {
    const updatedChecklist: ChecklistItem[] = [...form.values.checklist];
    updatedChecklist[index].dropdownValue = value || '';
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleRemoveChecklistItem = (index: number) => {
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist.splice(index, 1);
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleChecklistCheckboxChange = (index: number, checked: boolean) => {
    const updatedChecklist: ChecklistItem[] = [...form.values.checklist];
    updatedChecklist[index].checked = checked;
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleDeleteChecklistItem = (index: number) => {
    // Remove checklist item from form state
    const updatedChecklist = [...form.values.checklist];
    updatedChecklist.splice(index, 1);
    form.setFieldValue('checklist', updatedChecklist);
  };

  const handleClick = (color: string) => {
    console.log('Clicked color:', color);
  };
  const handleTextEditorChange = (content: string) => {
    form.setFieldValue('taskDescription', content);
  };
  return (
    <div>
      {/* Add Task Container */}
      <form onSubmit={form.handleSubmit}>
        <Grid>
          {/* Add Task Container 70% */}
          <Grid.Col span={{ base: 12, md: 6, lg: 8 }}>
            <Grid.Col>
              <label>Title *</label>
              <TextInput
                placeholder="Enter title"
                withAsterisk
                onChange={e =>
                  !viewOrUpdate?.isReadOnly &&
                  form.setFieldValue('taskTitle', e)
                }
                value={form.values.taskTitle}
              />
            </Grid.Col>
            <Grid.Col>
              <label>Description</label>
              <Textarea
                placeholder="Enter Description"
                withAsterisk
                onChange={e =>
                  !viewOrUpdate?.isReadOnly &&
                  form.setFieldValue('taskDescription', e.target.value)
                }
                value={form.values.taskDescription}
              />

              {/* <TextEditor /> */}
            </Grid.Col>
            <Grid.Col>
              <Grid gutter={{ base: 5, xs: 'md', md: 'xl', xl: 50 }}>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Button
                    variant="outline"
                    autoContrast
                    color={theme.colors.primaryColors[0]}
                    size="sm"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={handleAddChecklistItem}
                    leftSection={<MdChecklistRtl size={16} />}
                  >
                    Add Checklist
                  </Button>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Button
                    type="button"
                    variant="outline"
                    autoContrast
                    color={theme.colors.primaryColors[0]}
                    size="sm"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={handleAddLocation}
                    leftSection={<HiOutlineLocationMarker size={16} />}
                  >
                    Add Location
                  </Button>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
                  <Button
                    variant="outline"
                    autoContrast
                    color={theme.colors.primaryColors[0]}
                    size="sm"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={handleAddAttachmentClick}
                    leftSection={<MdAttachFile size={16} />}
                  >
                    Add Attachment
                  </Button>
                </Grid.Col>
                <Grid.Col span={{ base: 12, md: 12, lg: 12 }}>
                  {form.values.checklist?.map(
                    (item: ChecklistItem, index: number) => (
                      <div key={index} className="flex items-center mt-1">
                        <Checkbox
                          checked={item.checked}
                          size="md"
                          onChange={e =>
                            handleChecklistCheckboxChange(index, e)
                          }
                        />

                        <TextInput
                          placeholder="Enter text"
                          value={item.text}
                          onChange={e => handleChecklistTextChange(index, e)}
                          className="ml-2"
                        />
                        <Select
                          placeholder="Select value"
                          value={item.dropdownValue}
                          onChange={(value: string | null) =>
                            handleChecklistDropdownChange(index, value)
                          }
                          data={['Option 1', 'Option 2', 'Option 3']?.map(
                            option => ({
                              value: option,
                              label: option,
                            })
                          )}
                          className="ml-2"
                        />

                        <AiOutlineDelete
                          color={'#FF6666'}
                          onClick={() => handleRemoveChecklistItem(index)}
                          size={24}
                          className="cursor-pointer ml-2"
                        />
                      </div>
                    )
                  )}
                </Grid.Col>
              </Grid>
            </Grid.Col>
            <Grid.Col>
              <label>Associated To</label>
              <TextInput
                placeholder="Enter value"
                radius="xl"
                value={form.values.associatedTo}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly &&
                  form.setFieldValue('associatedTo', e)
                }
                name="associatedTo"
              />
            </Grid.Col>
            <Grid.Col>
              <h2 className="mb-2">Task Color</h2>
              <SimpleGrid cols={{ base: 6, md: 6, lg: 14 }} spacing="xs">
                {colorArray?.map((color, index) => (
                  <div key={index}>
                    <a
                      onClick={() => handleClick(color)}
                      style={{ color }}
                      className="cursor-pointer"
                    >
                      <FaCircle size={25} />
                    </a>
                  </div>
                ))}
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
                value={form.values.taskStatus}
                onChange={value => form.setFieldValue('taskStatus', value)}
                data={['inProgress', 'done', 'toDo']?.map(status => ({
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
                value={form.values.assigned}
                onChange={value => form.setFieldValue('assigned', value)}
                data={userList?.map((user: any) => {
                  return { label: user.name, value: user.userId?.toString() };
                })}
              />
            </Grid.Col>
            <Grid.Col>
              <label>Priority</label>
              <Select
                placeholder="Select priority"
                withAsterisk
                value={form.values.priority}
                onChange={value => form.setFieldValue('priority', value)}
                data={['high', 'medium', 'low'].map(priority => ({
                  value: priority,
                  label: priority,
                }))}
              />
            </Grid.Col>
            <Grid.Col>
              <label>Start Date and Time</label>
              <DateTimePicker
                placeholder="Select start date and time"
                withAsterisk
                value={new Date(form?.values?.startDateTime)}
                onChange={value => form.setFieldValue('startDateTime', value)}
              />
            </Grid.Col>
            <Grid.Col>
              <label>End Date and Time</label>
              <DateTimePicker
                placeholder="Select end date and time"
                withAsterisk
                value={new Date(form?.values?.endDateTime)}
                onChange={value => form.setFieldValue('endDateTime', value)}
              />
            </Grid.Col>
            <Grid.Col>
              <label>Repeat</label>
              <Select
                placeholder="Select repeat option"
                withAsterisk
                value={form.values.repeatedTask}
                onChange={value => form.setFieldValue('repeatedTask', value)}
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
                // type="number"
                value={form.values.hoursSpent}
                onChange={e =>
                  !viewOrUpdate?.isReadOnly &&
                  form.setFieldValue('hoursSpent', e)
                }
                name="hoursSpent"
              />
            </Grid.Col>
          </Grid.Col>
          {/* End of Add Task Container 30% */}
        </Grid>
        {!viewOrUpdate?.isReadOnly && (
          <Flex
            mih={50}
            gap="xs"
            justify="flex-end"
            align="flex-start"
            direction="row"
            wrap="wrap"
            className="mb-5"
          >
            <Button
              variant="outline"
              autoContrast
              color={theme.colors.secondaryColors[3]}
              size="md"
              onClick={onCloseButton}
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <Text tt="capitalize" fs="italic">
                {'Cancel'}
              </Text>
            </Button>
            <Button
              variant="outline"
              autoContrast
              color={theme.colors.primaryColors[0]}
              size="md"
              type="submit"
              style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
            >
              <Text tt="capitalize" fs="italic">
                {mode === 'Add' ? 'Create' : 'Update'}
              </Text>
            </Button>
          </Flex>
        )}
        <input
          id="attachment-input"
          type="file"
          accept="image/*, .pdf, .doc, .docx"
          style={{ display: 'none' }}
          onChange={handleAttachmentChange}
        />

        {form?.values?.checklist?.map((item: any, index: number) => (
          <div key={index} className="flex items-center mt-4"></div>
        ))}
      </form>
    </div>
  );
}
