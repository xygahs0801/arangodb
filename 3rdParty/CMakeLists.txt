# -*- mode: CMAKE; -*-

# ------------------------------------------------------------------------------
# External Projects used by ArangoDB
# ------------------------------------------------------------------------------

include(ExternalProject)

################################################################################
## boost
################################################################################

add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/boost)

################################################################################
## V8 and ICU
################################################################################

add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/chakrashim)
set(ICU_DT "${ICU_DT}" PARENT_SCOPE)
set(ICU_DT_DEST "${ICU_DT_DEST}" PARENT_SCOPE)

################################################################################
## ZLIB
################################################################################

set(SKIP_INSTALL_ALL ON)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/zlib/zlib-1.2.8)

################################################################################
## cURL
################################################################################

set(ENABLE_MANUAL OFF CACHE type BOOL)
set(BUILD_CURL_EXE OFF CACHE type BOOL)
set(BUILD_TESTING OFF CACHE type BOOL)
set(CURL_STATICLIB ON CACHE type BOOL)
set(HTTP_ONLY ON CACHE type BOOL)
set(CMAKE_USE_LIBSSH2 OFF CACHE type BOOL)
set(CMAKE_USE_OPENSSL ON CACHE type BOOL)
# mop: super important...if this is off curl will not handle request timeouts < 1000ms
set(ENABLE_THREADED_RESOLVER ON CACHE type BOOL)
# bugfix for HAVE_POSIX_STRERROR_R define on cross compiling. 
if (CROSS_COMPILING)
 add_definitions("-DHAVE_POSIX_STRERROR_R=1")
endif()
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/curl/curl-7.50.3)

################################################################################
## ROCKSDB
################################################################################

if (${JEMALLOC_FOUND})
#   set(USE_JEMALLOC_DEFAULT 1)
endif()
set(SKIP_INSTALL_ALL ON)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/snappy/google-snappy-d53de18)
add_subdirectory(${CMAKE_CURRENT_SOURCE_DIR}/rocksdb/rocksdb)

################################################################################
## LINK_DIRECTORIES
################################################################################

set(LINK_DIRECTORIES "${LINK_DIRECTORIES}" PARENT_SCOPE)

