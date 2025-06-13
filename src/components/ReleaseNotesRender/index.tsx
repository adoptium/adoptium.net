"use client"

import React, { useRef, MutableRefObject } from "react"
import { useTranslations, useLocale } from "next-intl";
import {
  DataGrid,
  GridColDef,
  Toolbar,
  ToolbarButton,
  gridClasses,
} from "@mui/x-data-grid"
import { enUS, frFR, deDE, esES, zhCN, ptBR } from '@mui/x-data-grid/locales';
import CircularProgress from '@mui/material/CircularProgress';
import {
  useFetchReleaseNotesForVersion,
  useOnScreen,
  ReleaseNoteAPIResponse,
} from "@/hooks"
import { useSearchParams } from "next/navigation"
import "./styles.css"

export const fetchTitle = (priority: string) => {
  let title
  switch (priority) {
    case "1":
      title =
        "P1 - Blocks development and/or testing work, production could not run."
      break
    case "2":
      title = "P2 - Crashes, loss of data, severe memory leak."
      break
    case "3":
      title = "P3 - Major loss of function."
      break
    case "4":
      title =
        "P4 - Minor loss of function, or other problem where easy workaround is present."
      break
    case "5":
      title = "P5 - Cosmetic problem like misspelt words or misaligned text."
      break
    case "6":
      title = "This issue is not publicly visible."
  }
  return title
}

export const sortReleaseNotesBy = (releaseNotes: ReleaseNoteAPIResponse) => {
  // issues/1508: Should initially be sorted by (a) priority then (b) component.
  if (releaseNotes && Array.isArray(releaseNotes.release_notes)) {
    releaseNotes.release_notes = [...releaseNotes.release_notes].sort(
      (v1, v2) => {
        let c = 0
        if (v1.priority && v2.priority) {
          c = v1.priority.localeCompare(v2.priority)
        }
        if (c === 0 && v1.component && v2.component) {
          c = v1.component.localeCompare(v2.component)
        }
        return c
      },
    )
  }
  return releaseNotes
}

const CustomToolbar = () => {
  return (
    <Toolbar>
      <ToolbarButton />
    </Toolbar>
  );
};

const priorityValueOptions: string[] = []
const typeValueOptions: string[] = []
const componentValueOptions: string[] = []

const columns: GridColDef[] = [
  {
    field: "priority",
    headerName: "Priority",
    type: "singleSelect",
    valueOptions: priorityValueOptions,
    width: 120,
    renderCell: params => {
      const title = fetchTitle(params.value)
      return (
        // check if params.value is defined, if not, return an empty string
        <span
          title={title}
          className={`badge bg-secondary priority-${params.value}`}
        >
          {params.value && params.value !== "6" ? `P${params.value}` : "P?"}
        </span>
      )
    },
  },
  {
    field: "type",
    headerName: "Type",
    type: "singleSelect",
    valueOptions: typeValueOptions,
    width: 130,
    sortable: false,
    renderCell: params => <span>{params.value ? params.value : "Hidden"}</span>,
  },
  {
    field: "component",
    headerName: "Component",
    type: "singleSelect",
    valueOptions: componentValueOptions,
    width: 180,
    sortable: false,
  },
  {
    field: "id",
    headerName: "Issue",
    width: 160,
    sortable: false,
    renderCell: params => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={params.row.link}
        className="issue-link"
      >
        {params.value}
      </a>
    ),
  },
  { field: "title", headerName: "Title", width: 800, sortable: false },
]

// Map next-intl/Next.js locale to MUI DataGrid localeText
import type { GridLocaleText } from "@mui/x-data-grid";

const muiLocaleMap: Record<string, GridLocaleText> = {
  en: enUS.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
  'en-GB': enUS.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
  fr: frFR.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
  de: deDE.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
  es: esES.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
  'pt-BR': ptBR.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
  'zh-CN': zhCN.components.MuiDataGrid.defaultProps.localeText as GridLocaleText,
}

const ReleaseNotesRender = () => {
  const t = useTranslations("ReleaseNotes")
  const locale = useLocale();
  const searchParams = useSearchParams();
  const rawVersion = searchParams.get("version");
  const version = rawVersion ? rawVersion.replace(/ /g, "+") : undefined;

  const ref = useRef<HTMLDivElement | null>(null)
  const isVisible = useOnScreen(ref as MutableRefObject<Element>, true)

  const releaseNoteDataBag = useFetchReleaseNotesForVersion(isVisible, version, sortReleaseNotesBy);
  const releaseNotes = releaseNoteDataBag ? releaseNoteDataBag.releaseNoteAPIResponse : null;
  const releaseNotesVersion = releaseNotes ? releaseNotes.release_name : null;

  // Pick the correct MUI localeText for DataGrid
  const muiLocaleObject = muiLocaleMap[locale] || enUS.components.MuiDataGrid.defaultProps.localeText;

  if (releaseNotes && Array.isArray(releaseNotes.release_notes)) {
    const priorities: string[] = []
    const types: string[] = []
    const components: string[] = []

    releaseNotes.release_notes.forEach(release_note => {
      // Set all priorities set as undefined to '?' to avoid errors
      if (release_note.priority === undefined) {
        release_note.priority = '6';
      }

      if (
        release_note.priority &&
        priorities.indexOf(release_note.priority) < 0
      )
        priorities.push(release_note.priority)
      if (release_note.type && types.indexOf(release_note.type) < 0)
        types.push(release_note.type)
      if (
        release_note.component &&
        components.indexOf(release_note.component) < 0
      )
        components.push(release_note.component)
    })

    priorityValueOptions.splice(0)
    Array.prototype.push.apply(
      priorityValueOptions,
      priorities.sort((a, b) => a.localeCompare(b)),
    )
    typeValueOptions.splice(0)
    Array.prototype.push.apply(
      typeValueOptions,
      types.sort((a, b) => a.localeCompare(b)),
    )
    componentValueOptions.splice(0)
    Array.prototype.push.apply(
      componentValueOptions,
      components.sort((a, b) => a.localeCompare(b)),
    )
  }

  interface FilterItem {
    field: string
    operator: string
    value: string
  }

  // Set type to 'Enhancement' by default if version matches jdk-xx+xx
  const regex = /^jdk-(2\d|\d{3,})\+\d+$/
  const filterItems: FilterItem[] = []
  if (releaseNotesVersion?.toString && regex.test(releaseNotesVersion.toString())) {
    filterItems.push({
      field: "type",
      operator: "is",
      value: "Enhancement",
    })
  }

  const totalP1 = releaseNotes?.release_notes?.filter(
    note => note.priority === "1",
  ).length

  return (
    <div ref={ref} className="release-notes-container mx-auto max-w-4xl p-6 lg:px-0 items-center text-center justify-center">
      <div className="self-stretch text-center text-lightgrey text-[20px] font-normal leading-[140%] mx-auto max-w-[860px] px-2 w-full mb-4">
        <h2 className="release-notes-title">{releaseNotesVersion}</h2>
      </div>
      <div className="pt-3" style={{ display: "flex", justifyContent: "center", height: "100%" }}>
        {!releaseNoteDataBag ? <div style={{ flexGrow: 1 }}><CircularProgress aria-label='loading spinner' /></div> :
          (<div className="max-w-6xl" style={{ flexGrow: 1 }}>
            {!releaseNotesVersion || releaseNoteDataBag?.isValid === false ? (
              <div className="bg-gradient-to-br from-[#200E46]/90 to-[#2B1A4F]/90 rounded-3xl border border-white/20 shadow-lg p-8 text-center">
                <h2 className="release-notes-title mb-4">{t('couldnt-find-release-notes')}</h2>
                <span className="text-white/80 text-lg">
                  {t('not-found-helper')} <code className="bg-[#14003c] px-2 py-1 rounded text-pink">?version=x.x.x</code>
                </span>
              </div>
            ) : (
              <>
                <p className="release-notes-description">
                  {t('description')}
                </p>
                <p className="release-notes-description">
                  <strong>{`The total number of fixes marked as P1 is: ${totalP1}`}</strong>
                </p>
                <DataGrid
                  aria-label="Release Notes"
                  localeText={muiLocaleObject}
                  autoHeight
                  rows={
                    releaseNotes && releaseNotes.release_notes
                      ? releaseNotes.release_notes
                      : []
                  }
                  loading={releaseNotes === null}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 20,
                      },
                    },
                    filter: {
                      filterModel: {
                        items: filterItems,
                      },
                    },
                    sorting: {
                      sortModel: [{ field: "priority", sort: "asc" }],
                    },
                  }}
                  sortingOrder={["desc", "asc"]}
                  pageSizeOptions={[20, 50, 75]}
                  pagination
                  isRowSelectable={() => false}
                  slots={{
                    toolbar: CustomToolbar,
                  }}
                  getRowHeight={() => "auto"}
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      py: 1,
                    },
                    [`& .${gridClasses.columnHeaders}`]: {
                      backgroundColor: 'rgba(43, 26, 79, 0.95)',
                      color: 'white',
                    },
                    [`& .${gridClasses.columnHeader}`]: {
                      backgroundColor: 'rgba(43, 26, 79, 0.95)',
                      color: 'white',
                    },
                    [`& .${gridClasses.columnHeaderTitle}`]: {
                      color: 'white',
                    },
                  }}
                />
              </>
            )}
          </div>
          )}
      </div>
    </div>
  )
}

export default ReleaseNotesRender
