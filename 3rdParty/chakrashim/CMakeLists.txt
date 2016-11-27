cmake_minimum_required(VERSION 2.8)
project(ChakraShim CXX)

set(LIBUV_USE_STATIC 1)
find_package(LibUV)

add_library(chakrashim
        chakrashim/include/libplatform/libplatform.h
        chakrashim/include/v8.h
        chakrashim/include/v8config.h
        chakrashim/include/v8-debug.h
        chakrashim/include/v8-platform.h
        chakrashim/include/v8-profiler.h
        chakrashim/include/v8-version.h
        chakrashim/src/jsrtcachedpropertyidref.inc
        chakrashim/src/jsrtcontextcachedobj.inc
        chakrashim/src/jsrtcontextshim.cc
        chakrashim/src/jsrtcontextshim.h
        chakrashim/src/jsrtdebug.cc
        chakrashim/src/jsrtdebug.h
        chakrashim/src/jsrtisolateshim.cc
        chakrashim/src/jsrtisolateshim.h
        chakrashim/src/jsrtpromise.cc
        chakrashim/src/jsrtproxyutils.cc
        chakrashim/src/jsrtproxyutils.h
        chakrashim/src/jsrtutils.cc
        chakrashim/src/jsrtutils.h
        chakrashim/src/v8array.cc
        chakrashim/src/v8arraybuffer.cc
        chakrashim/src/v8boolean.cc
        chakrashim/src/v8booleanobject.cc
        chakrashim/src/v8chakra.cc
        chakrashim/src/v8chakra.h
        chakrashim/src/v8context.cc
        chakrashim/src/v8date.cc
        chakrashim/src/v8debug.cc
        chakrashim/src/v8exception.cc
        chakrashim/src/v8external.cc
        chakrashim/src/v8function.cc
        chakrashim/src/v8functiontemplate.cc
        chakrashim/src/v8global.cc
        chakrashim/src/v8handlescope.cc
        chakrashim/src/v8int32.cc
        chakrashim/src/v8integer.cc
        chakrashim/src/v8isolate.cc
        chakrashim/src/v8message.cc
        chakrashim/src/v8number.cc
        chakrashim/src/v8numberobject.cc
        chakrashim/src/v8object.cc
        chakrashim/src/v8objecttemplate.cc
        chakrashim/src/v8persistent.cc
        chakrashim/src/v8private.cc
        chakrashim/src/v8proxy.cc
        chakrashim/src/v8script.cc
        chakrashim/src/v8signature.cc
        chakrashim/src/v8stacktrace.cc
        chakrashim/src/v8string.cc
        chakrashim/src/v8stringobject.cc
        chakrashim/src/v8template.cc
        chakrashim/src/v8trycatch.cc
        chakrashim/src/v8typedarray.cc
        chakrashim/src/v8uint32.cc
        chakrashim/src/v8v8.cc
        chakrashim/src/v8value.cc
)

add_dependencies(chakrashim Chakra.Jsrt Chakra.Pal)

target_include_directories(chakrashim PUBLIC
  .
  chakrashim/include
  chakrashim/core/lib/jsrt
  chakrashim/core/lib/common
  ${LIBUV_INCLUDE_DIRS}
)

set(ICU_INCLUDE_PATH /usr/local/opt/icu4c/include)
#set(STATIC_LIBRARY_SH 1)
set(CC_TARGETS_AMD64_SH ON)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/chakrashim/core)

