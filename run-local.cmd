@echo off
REM ============================================================
REM FILE: run-local.cmd
REM PURPOSE: Provides the Windows command launcher that forwards local commands to Storage Forensics's Node.js entry point.
REM ============================================================

node "%~dp0src\cli.mjs" %*
