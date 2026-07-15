import { Button, Card, Checkbox, Label, Select, Textarea, TextInput } from 'flowbite-react'
import React, { useEffect } from 'react'
import { Form, Link, redirect } from 'react-router'
import type { Route } from './+types/Contact'
import { ContactFormSubmit } from "~/db.server"

type Props = {}
export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData()
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;
    const surname = formData.get("surname") as string;
    const tel = String(formData.get("tel"))
    const contact_reason = formData.get("contact-reason") as string
    const message = formData.get("message") as string
    console.log(email, name, surname, tel, contact_reason, message)
    const result = ContactFormSubmit({ email, name, surname, tel, contact_reason, message })
    if ((await result).success) {
        return { success: true }
    }
}
function Contact({ actionData }: Route.ComponentProps) {
    useEffect(() => {
        if (actionData?.success === true) {
            alert("Message Successfuilly sent !")
            window.location.reload()
        }
    }, [actionData])

    return (
        <div className=''>
            <h1 className='text-center text-2xl'>Contact Us</h1>
            <div className='flex justify-center gap-4 mt-4'>
                <Card className='w-full '>
                    <Form method='post' className="flex max-w-md flex-col gap-4 mx-12">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email2">Your email</Label>
                            </div>
                            <TextInput id="email2" type="email" placeholder="name@flowbite.com" required shadow
                                name='email' />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Name</Label>
                            </div>
                            <TextInput type='text' required
                                name='name' />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="name">Surname</Label>
                            </div>
                            <TextInput type='text' required
                                name='surname' />
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password2">Contact Phone</Label>
                            </div>
                            <TextInput type="tel"
                                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required
                                placeholder='123-456-7890'
                                name='tel' />
                        </div>
                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="countries">Select your Reason</Label>
                            </div>
                            <Select id="countries" required name='contact-reason'>
                                <option>Job position</option>
                                <option>Support</option>
                                <option>Problem with Order</option>
                                <option >Other</option>
                            </Select>
                        </div>

                        <div className="max-w-md">
                            <div className="mb-2 block">
                                <Label htmlFor="comment">Your message</Label>
                            </div>
                            <Textarea id="comment" placeholder="Leave a comment..."
                                required rows={4} name='message' />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="agree" required />
                            <Label htmlFor="agree" className="flex">
                                I agree with the&nbsp;
                                <span
                                    className="text-cyan-600 hover:underline dark:text-cyan-500">
                                    terms and conditions
                                </span>
                            </Label>
                        </div>
                        <Button type="submit"
                            style={{ backgroundColor: "#AD9471" }}
                        >Send</Button>
                    </Form>
                </Card >
                <Card className='w-auto p-30'>
                    <div className='flex flex-col justify-around gap-10 text-center' >
                        <h2 className='text-xl'>Communication Details</h2>
                        <div>
                            <h3 className='text-lg'>Phone: <span>123-456-7890</span></h3>
                        </div>
                        <div>
                            <h3 className='text-lg'>Email: <span>OuraShop@outlook.com</span></h3>
                        </div>

                    </div>
                </Card>
            </div >
            <Card className='mt-4'>
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d5567.983400653774!2d0.9801848749462396!3d51.00487112167655!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e1!3m2!1sel!2sgr!4v1784023663805!5m2!1sel!2sgr" width="600" height="450" style={{ border: "0" }} className='w-full' loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
            </Card>
        </div >
    )
}

export default Contact