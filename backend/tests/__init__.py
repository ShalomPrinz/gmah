import signal
import os

from tests.families_util import tearDownFamilies
from tests.managers_util import tearDownManagers
from tests.report_util import tearDownMonth

def handle_interrupt(signum, frame):
    print("\nCleaning up...")
    tearDownFamilies()
    tearDownManagers()
    tearDownMonth()
    print("Stopped testing gracefully")
    os._exit(0)

signal.signal(signal.SIGINT, handle_interrupt)
