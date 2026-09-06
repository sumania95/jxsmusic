"use client";

import {
  forwardRef,
  useState,
  type ComponentPropsWithoutRef,
  type FormEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  Ban,
  CheckCircle2,
  CreditCard,
  Disc3,
  EyeOff,
  Layers3,
  Loader2,
  Music2,
  Pencil,
  Plus,
  UserCheck,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/utils/api";

interface Props {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  username: string | null;
  is_uploader: boolean;
  createdAt: Date;
  totalTracks: number;
  publishedTracks: number;
  credit: number;
  unpublishedTracks: number;
  is_disabled: boolean;
}

export default function AdminUserItem(props: Props) {
  const displayName =
    props.name ??
    props.email ??
    "Unnamed user";

  return (
    <div
      className={[
        "flex w-full flex-col gap-4 px-4 py-4 sm:px-5 xl:flex-row xl:items-center",
        props.is_disabled ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* User */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="relative shrink-0">
          <Avatar className="h-12 w-12 rounded-xl border border-white/[0.08] bg-zinc-950">
            <AvatarImage
              src={props.image ?? ""}
              alt={displayName}
              className="object-cover"
            />

            <AvatarFallback className="rounded-xl bg-zinc-950">
              <Image
                src="/images/jeff92-ayan-brand-mark.svg"
                alt="Logo"
                width={64}
                height={64}
                className="h-full w-full object-cover"
              />
            </AvatarFallback>
          </Avatar>

          {props.is_uploader && (
            <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-zinc-950 bg-[#B9FF00] text-black">
              <Music2 className="h-2.5 w-2.5" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="max-w-[220px] truncate text-sm font-semibold text-zinc-200">
              {props.name ?? "Unnamed User"}
            </span>

            <div className="sm:hidden">
              <RoleBadge
                isUploader={props.is_uploader}
              />
            </div>

            {props.is_disabled && (
              <Badge
                variant="outline"
                className="gap-1 rounded-full border-red-400/20 bg-red-400/[0.07] px-2 py-0 text-[9px] text-red-400"
              >
                <Ban className="h-2.5 w-2.5" />
                Disabled
              </Badge>
            )}
          </div>

          <span className="block max-w-[220px] truncate text-[11px] text-zinc-600">
            @{props.username ?? "no-username"}
          </span>

          <span className="mt-0.5 block max-w-[260px] truncate text-[10px] text-zinc-700">
            {props.email ?? "No email"}
          </span>
        </div>
      </div>

      {/* Role */}
      <div className="hidden w-[110px] shrink-0 justify-center sm:flex">
        <RoleBadge
          isUploader={props.is_uploader}
        />
      </div>

      {/* Statistics */}
      <div className="grid w-full grid-cols-2 gap-2 border-t border-white/[0.05] pt-3 sm:grid-cols-4 xl:w-auto xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
        <StatCard
          label="Total"
          value={props.totalTracks}
          icon={Layers3}
          color="zinc"
        />

        <StatCard
          label="Published"
          value={props.publishedTracks}
          icon={CheckCircle2}
          color="green"
        />

        <StatCard
          label="Unpublished"
          value={props.unpublishedTracks}
          icon={EyeOff}
          color="amber"
        />

        <StatCard
          label="Credit"
          value={props.credit}
          icon={CreditCard}
          color="violet"
        />
      </div>

      {/* Actions */}
      <UserActions
        userId={props.id}
        userName={displayName}
        currentCredit={props.credit}
        isDisabled={props.is_disabled}
      />
    </div>
  );
}

type RoleBadgeProps = {
  isUploader: boolean;
};

function RoleBadge({
  isUploader,
}: RoleBadgeProps) {
  if (isUploader) {
    return (
      <Badge
        variant="outline"
        className="gap-1.5 rounded-full border-[#B9FF00]/20 bg-[#B9FF00]/[0.07] px-3 text-[10px] font-medium text-[#B9FF00]"
      >
        <Disc3 className="h-3 w-3" />
        Uploader
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1.5 rounded-full border-white/[0.08] bg-white/[0.025] px-3 text-[10px] font-medium text-zinc-500"
    >
      <UserRound className="h-3 w-3" />
      User
    </Badge>
  );
}

type StatColor =
  | "zinc"
  | "green"
  | "amber"
  | "violet";

const statColorClasses: Record<
  StatColor,
  {
    container: string;
    icon: string;
  }
> = {
  zinc: {
    container:
      "border-white/[0.07] bg-white/[0.02]",
    icon: "bg-white/[0.05] text-zinc-500",
  },
  green: {
    container:
      "border-green-400/10 bg-green-400/[0.025]",
    icon: "bg-green-400/10 text-green-400",
  },
  amber: {
    container:
      "border-amber-400/10 bg-amber-400/[0.025]",
    icon: "bg-amber-400/10 text-amber-400",
  },
  violet: {
    container:
      "border-violet-400/10 bg-violet-400/[0.025]",
    icon: "bg-violet-400/10 text-violet-400",
  },
};

type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  color: StatColor;
};

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: StatCardProps) {
  const classes = statColorClasses[color];

  return (
    <div
      className={[
        "flex min-w-[95px] items-center gap-2 rounded-xl border px-3 py-2",
        classes.container,
      ].join(" ")}
    >
      <div
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          classes.icon,
        ].join(" ")}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>

      <div className="flex min-w-0 flex-col">
        <span className="truncate text-[8px] uppercase tracking-[0.12em] text-zinc-600">
          {label}
        </span>

        <span className="text-xs font-semibold tabular-nums text-zinc-300">
          {value}
        </span>
      </div>
    </div>
  );
}

type UserActionsProps = {
  userId: string;
  userName: string;
  currentCredit: number;
  isDisabled: boolean;
};

function UserActions({
  userId,
  userName,
  currentCredit,
  isDisabled,
}: UserActionsProps) {
  const utils = api.useUtils();

  const refreshUsers = async () => {
    await utils.user.getAll.invalidate();
  };

  return (
    <div className="flex w-full shrink-0 items-center justify-end gap-2 border-t border-white/[0.05] pt-3 xl:w-auto xl:border-l xl:border-t-0 xl:pl-4 xl:pt-0">
      <SetCreditDialog
        userId={userId}
        currentCredit={currentCredit}
        onSuccess={refreshUsers}
      />

      <AddCreditDialog
        userId={userId}
        onSuccess={refreshUsers}
      />

      <DisableUserDialog
        userId={userId}
        userName={userName}
        isDisabled={isDisabled}
        onSuccess={refreshUsers}
      />
    </div>
  );
}

type MutationDialogProps = {
  userId: string;
  onSuccess: () => Promise<void>;
};

type SetCreditDialogProps =
  MutationDialogProps & {
    currentCredit: number;
  };

function SetCreditDialog({
  userId,
  currentCredit,
  onSuccess,
}: SetCreditDialogProps) {
  const [open, setOpen] = useState(false);

  const [credit, setCredit] = useState(
    String(currentCredit),
  );

  const mutation =
    api.user.setCredit.useMutation({
      onSuccess: async () => {
        setOpen(false);
        await onSuccess();
      },
    });

  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    if (mutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      setCredit(String(currentCredit));
      mutation.reset();
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = Number(credit);

    if (
      !Number.isInteger(value) ||
      value < 0
    ) {
      return;
    }

    mutation.mutate({
      userId,
      credit: value,
    });
  };

  const value = Number(credit);

  const isValid =
    credit.trim() !== "" &&
    Number.isInteger(value) &&
    value >= 0;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <ActionButton
          label="Set credit balance"
          icon={Pencil}
          className="hover:border-[#B9FF00]/20 hover:bg-[#B9FF00]/10 hover:text-[#B9FF00]"
        />
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-[#171d20] text-white sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Set credit balance
            </DialogTitle>

            <DialogDescription className="text-zinc-500">
              Replace the customer&apos;s current
              credit balance. Their current balance
              is {currentCredit}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5">
            <label
              htmlFor={`set-credit-${userId}`}
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              New credit balance
            </label>

            <Input
              id={`set-credit-${userId}`}
              type="number"
              min={0}
              step={1}
              value={credit}
              onChange={(event) =>
                setCredit(event.target.value)
              }
              disabled={mutation.isPending}
              autoFocus
              className="border-white/10 bg-white/[0.025] text-white"
            />

            <MutationError>
              {mutation.error?.message}
            </MutationError>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => setOpen(false)}
              className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !isValid ||
                mutation.isPending
              }
              className="bg-[#B9FF00] text-black hover:bg-[#B9FF00]/90"
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Update balance
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddCreditDialog({
  userId,
  onSuccess,
}: MutationDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("1");

  const mutation =
    api.user.addCredit.useMutation({
      onSuccess: async () => {
        setOpen(false);
        setAmount("1");
        await onSuccess();
      },
    });

  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    if (mutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      setAmount("1");
      mutation.reset();
    }
  };

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const value = Number(amount);

    if (
      !Number.isInteger(value) ||
      value < 1
    ) {
      return;
    }

    mutation.mutate({
      userId,
      amount: value,
    });
  };

  const value = Number(amount);

  const isValid =
    amount.trim() !== "" &&
    Number.isInteger(value) &&
    value >= 1;

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <DialogTrigger asChild>
        <ActionButton
          label="Add credits"
          icon={Plus}
          className="hover:border-violet-400/20 hover:bg-violet-400/10 hover:text-violet-400"
        />
      </DialogTrigger>

      <DialogContent className="border-white/10 bg-[#171d20] text-white sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              Add credits
            </DialogTitle>

            <DialogDescription className="text-zinc-500">
              Add credits to the customer&apos;s
              existing balance.
            </DialogDescription>
          </DialogHeader>

          <div className="py-5">
            <label
              htmlFor={`add-credit-${userId}`}
              className="mb-2 block text-xs font-medium text-zinc-400"
            >
              Credits to add
            </label>

            <Input
              id={`add-credit-${userId}`}
              type="number"
              min={1}
              step={1}
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              disabled={mutation.isPending}
              autoFocus
              className="border-white/10 bg-white/[0.025] text-white"
            />

            <MutationError>
              {mutation.error?.message}
            </MutationError>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={mutation.isPending}
              onClick={() => setOpen(false)}
              className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                !isValid ||
                mutation.isPending
              }
              className="bg-violet-400 text-black hover:bg-violet-400/90"
            >
              {mutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Add credits
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type DisableUserDialogProps =
  MutationDialogProps & {
    userName: string;
    isDisabled: boolean;
  };

function DisableUserDialog({
  userId,
  userName,
  isDisabled,
  onSuccess,
}: DisableUserDialogProps) {
  const [open, setOpen] = useState(false);

  const mutation =
    api.user.setDisabled.useMutation({
      onSuccess: async () => {
        setOpen(false);
        await onSuccess();
      },
    });

  const handleOpenChange = (
    nextOpen: boolean,
  ) => {
    if (mutation.isPending) {
      return;
    }

    setOpen(nextOpen);

    if (nextOpen) {
      mutation.reset();
    }
  };

  const handleMutation = () => {
    mutation.mutate({
      userId,
      disabled: !isDisabled,
    });
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={handleOpenChange}
    >
      <AlertDialogTrigger asChild>
        <ActionButton
          label={
            isDisabled
              ? "Enable user"
              : "Disable user"
          }
          icon={
            isDisabled
              ? UserCheck
              : Ban
          }
          className={
            isDisabled
              ? "text-green-400 hover:border-green-400/20 hover:bg-green-400/10 hover:text-green-400"
              : "hover:border-red-400/20 hover:bg-red-400/10 hover:text-red-400"
          }
        />
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-[#171d20] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDisabled
              ? "Enable this user?"
              : "Disable this user?"}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-500">
            {isDisabled
              ? `${userName} will regain access to protected account features.`
              : `${userName} will no longer be able to access protected account features.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <MutationError>
          {mutation.error?.message}
        </MutationError>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={mutation.isPending}
            className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            disabled={mutation.isPending}
            onClick={(event) => {
              /*
               * Prevent Radix from closing before
               * the mutation finishes.
               */
              event.preventDefault();
              handleMutation();
            }}
            className={
              isDisabled
                ? "bg-green-400 text-black hover:bg-green-400/90"
                : "bg-red-500 text-white hover:bg-red-500/90"
            }
          >
            {mutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {isDisabled
              ? "Enable user"
              : "Disable user"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/*
 * forwardRef and {...buttonProps} are required.
 *
 * DialogTrigger and AlertDialogTrigger inject their
 * onClick handlers and accessibility attributes here.
 */
type ActionButtonProps =
  ComponentPropsWithoutRef<typeof Button> & {
    label: string;
    icon: LucideIcon;
  };

const ActionButton = forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(function ActionButton(
  {
    label,
    icon: Icon,
    className,
    type = "button",
    ...buttonProps
  },
  ref,
) {
  return (
    <Button
      ref={ref}
      type={type}
      variant="outline"
      size="icon"
      title={label}
      className={[
        "h-9 w-9 rounded-xl border-white/[0.08] bg-white/[0.025] text-zinc-500",
        className ?? "",
      ].join(" ")}
      {...buttonProps}
    >
      <Icon className="h-3.5 w-3.5" />

      <span className="sr-only">
        {label}
      </span>
    </Button>
  );
});

ActionButton.displayName = "ActionButton";

function MutationError({
  children,
}: {
  children?: ReactNode;
}) {
  if (!children) {
    return null;
  }

  return (
    <p className="mt-2 text-xs text-red-400">
      {children}
    </p>
  );
}