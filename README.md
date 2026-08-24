# Storage Forensics

**Storage Forensics** is a portable, read-only local storage-analysis tool. It inventories a specific folder and produces a local HTML/JSON report covering metadata totals, filesystem capacity when available, first-level folder sizes, largest files, extension distribution, same-content duplicates, old files, exclusions, and snapshot growth comparisons.

> **Safety and privacy boundary:** Storage Forensics never deletes, moves, renames, uploads, or modifies scanned source files. File names, paths, timestamps, sizes, and report content can be sensitive; treat generated reports as private unless reviewed for sharing.

## What a scan does

The tool performs incremental directory traversal and skips symbolic links. It reads file metadata for the inventory. Duplicate detection first groups equal-size files and then streams only those candidate files through SHA-256 in 1 MiB chunks; it does not load candidate files entirely into memory. The report labels duplicate bytes as *potentially reclaimable after review*—it makes no deletion recommendation or automatic removal.

| Analysis | Behavior |
|---|---|
| Capacity | Reports total, free, and used filesystem capacity when the platform supplies it. |
| Folder map | Uses first-level relative folders as an equivalent visual distribution. |
| File types and largest files | Aggregates extensions and lists the 30 largest collected files. |
| Duplicates | Confirms same-content files using streaming SHA-256 for equal-size candidates. |
| Old files | Lists files older than the explicit `--old-days` threshold; age is an observation only. |
| Snapshots | Saves a versioned metadata index and compares added, removed, changed, file-count, and byte deltas. |

## Scope protection and exclusions

You must provide an explicit folder path. The CLI refuses the filesystem root and common protected system locations such as `/proc`, `/sys`, `/dev`, `/etc`, `/boot`, `/usr`, `/bin`, `/sbin`, and `/var/lib`. It excludes `.git`, `node_modules`, `.cache`, `System Volume Information`, and `$RECYCLE.BIN` by default. Add a basename exclusion with `--exclude`; use a specific data folder rather than a broad system location.

## Local Linux and Windows use

Install **Node.js 22+** and pnpm. The browser report is served only over `127.0.0.1` and the default port is configurable.

| Task | Linux / macOS shell | Windows PowerShell or Command Prompt |
|---|---|---|
| Run a read-only scan | `./run-local.sh scan /path/to/folder --out reports/scan` | `run-local.cmd scan C:\path\to\folder --out reports\scan` |
| Exclude a directory name | `./run-local.sh scan /path/to/folder --exclude node_modules --out reports/scan` | `run-local.cmd scan C:\path\to\folder --exclude node_modules --out reports\scan` |
| Save a snapshot | `./run-local.sh scan /path/to/folder --snapshot snapshots/current.json --out reports/current` | `run-local.cmd scan C:\path\to\folder --snapshot snapshots\current.json --out reports\current` |
| Compare a prior snapshot | `./run-local.sh scan /path/to/folder --compare snapshots/previous.json --out reports/compare` | `run-local.cmd scan C:\path\to\folder --compare snapshots\previous.json --out reports\compare` |
| Generate synthetic demo only | `./run-local.sh demo --out reports/demo` | `run-local.cmd demo --out reports\demo` |
| Serve a local report | `./run-local.sh serve reports/scan --port=4082` | `run-local.cmd serve reports\scan --port=4082` |

The demo creates clearly labeled **synthetic fixtures** beneath `reports/synthetic-fixture`; it does not scan personal folders. Generated reports live in the selected output directory as `storage-forensics.html` and `storage-forensics.json`. There is no hosted website URL for this repository.

## Snapshot interpretation

Snapshots contain relative path, size, and modification timestamp metadata; they do not include file contents. A comparison is meaningful only when scans use a comparable scope and exclusion set. The tool does not infer causation, ownership, retention policy, or whether a changed or duplicate file is safe to remove.

## Validation

```bash
pnpm install
pnpm test
pnpm check
pnpm demo
```

The test suite covers aggregation, duplicate grouping, exclusions, protected scopes, snapshots/growth comparisons, and report generation.

## License

MIT.
