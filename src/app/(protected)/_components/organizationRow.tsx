"use client"
import { Button } from "@/src/components/ui/button";
import { toast } from "sonner";
import { TableCell, TableRow, } from "@/src/components/ui/table"
import { useTransition } from "react";
import { DialogDemo } from "@/src/components/dialog-demo";


interface orgDataProps {
    id: string;
    name: string
    normalizedLowerCase: string;
}

interface orgRowDataProps {
    orgData: orgDataProps;
    onDeleteOrgData: (deleteOrgData: orgDataProps) => void;
}


import * as React from "react"

import { DialogFooter } from "@/src/components/ui/dialog";
import { organizationDelete } from "@/src/actions/organization";


export const OrganizationRow = ({ orgData, onDeleteOrgData }: orgRowDataProps) => {

    const { id } = orgData


    const [isPending, startTransition] = useTransition()



    const onSubmitDelete = () => {

        startTransition(() => {
            organizationDelete(id)
                .then((data) => {
                    if (data.error) {
                        toast.error(data.error);
                    }

                    if (data.success) {
                        toast.success(data.success);
                        onDeleteOrgData(data.deletedOrganization)

                    }
                })
                .catch(() => toast.error("Something went wrong!"));
        });
    }




    return (

        <TableRow key={orgData.id}>
            <TableCell className="font-medium text-center">{orgData.name}</TableCell>


            <TableCell className="text-center">
                <DialogDemo
                    dialogTrigger="Delete"
                    dialogTitle="Delete Organization"
                    dialogDescription="Do you want to delete this organization?"
                    ButtonLabel="yes"
                >
                    <DialogFooter>
                        <Button type="submit" variant="destructive" onClick={onSubmitDelete} disabled={isPending}>Yes</Button>
                    </DialogFooter>
                </DialogDemo>
            </TableCell>
        </TableRow >
    )
}

