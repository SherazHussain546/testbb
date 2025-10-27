
"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { signInWithEmail } from "../auth-actions";

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type AuthFormValues = z.infer<typeof authSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [state, formAction, isPending] = useActionState(signInWithEmail, null);

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (state?.success) {
      toast({ title: "Success", description: "Signed in successfully. Redirecting..." });
      router.push("/");
    } else if (state?.error) {
      toast({ variant: "destructive", title: "Authentication Failed", description: state.error });
    }
  }, [state, router, toast]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
        <div className="w-full max-w-sm mx-auto p-4 space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold font-headline">Sign In</h1>
                <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            <Form {...form}>
                <form action={formAction} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="you@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Signing In..." : "Sign In"}
                  </Button>
                </form>
            </Form>
        </div>
    </div>
  );
}
