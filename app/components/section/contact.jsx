"use client"

import React, { useState } from 'react'

import { Mail, Map, Phone } from 'lucide-react'

import { useForm } from "react-hook-form"
import { motion } from "framer-motion"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

const GetInTouch = () => {
  const [submitStatus, setSubmitStatus] = useState({ type: null, message: '' })

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  const onSubmit = async (data) => {
    try {
      setSubmitStatus({ type: null, message: '' })
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      // Check if response is ok and content-type is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        // Try to get the text response to see what we got
        const textResponse = await response.text()
        console.error('Non-JSON response received:', {
          status: response.status,
          statusText: response.statusText,
          contentType,
          body: textResponse.substring(0, 500) // First 500 chars
        })
        throw new Error(`Server returned non-JSON response (${response.status} ${response.statusText})`)
      }

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: 'Message sent successfully! We will get back to you soon.' 
        })
        reset()
        
        // Clear success message after 5 seconds
        setTimeout(() => {
          setSubmitStatus({ type: null, message: '' })
        }, 5000)
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.error || 'Failed to send message. Please try again.' 
        })
      }
    } catch (error) {
      console.error("🚨 Error:", error)
      setSubmitStatus({ 
        type: 'error', 
        message: 'Failed to send message. Please try again.' 
      })
    }
  }

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      transition={{
        duration: 1,
        damping: 50,
        delay: 0.2,
      }} id="contact" className="w-full  bg-[#ffbd2d]  py-8 md:py-16 px-4 md:px-14 lg:px-24 xl:px-32 2xl:px-40">
      <div className="">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Contact Us</h2>
            <p className="max-w-[900px]  md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Have a project in mind or want to collaborate? Feel free to reach out to me.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-14 md:gap-8 py-8 md:grid-cols-2">
            <div className="flex text-left flex-col items-start gap-2">
              <h3 className="text-xl text-left font-bold">Contact Information</h3>
              <p className="">Feel free to contact me through any of these channels:</p>
              <div className="mt-4 grid gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <span>081214707415</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <span>aplus@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Map className="h-5 w-5" />
                  <span>Jl. Sariwangi Selatan No.165, Cibabat, Kec. Cimahi Utara,
                    Kabupaten Bandung Barat, Jawa Barat 40559
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">Send Me a Message</h3>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                {submitStatus.type && (
                  <div
                    className={`p-3 rounded-md text-sm ${
                      submitStatus.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-300'
                        : 'bg-red-100 text-red-800 border border-red-300'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}
                <div className="grid gap-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Name
                  </Label>
                  <input
                    id="name"
                    {...register("name", { required: "Name is required" })}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your name"
                  />
                  {errors.name && <span className="text-red-500 text-left text-sm">*{errors.name.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Email
                  </Label>
                  <input
                    id="email"
                    type="email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  focus-visible:ring-0  disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your email"
                  />
                  {errors.email && <span className="text-red-500 text-left text-sm">*{errors.email.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label
                    htmlFor="message"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Message
                  </Label>
                  <textarea
                    id="message"
                    {...register("message", { required: "Message is required" })}
                    className="flex min-h-[120px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0  disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Your message"
                  />
                  {errors.message && <span className="text-red-500 text-left text-sm">*{errors.message.message}</span>}
                </div>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default GetInTouch